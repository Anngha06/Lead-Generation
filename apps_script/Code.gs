
// ===== Apps Script: Code.gs =====
const SHEET_ID = 'PUT_YOUR_SHEET_ID_HERE';

const COLUMNS = {
  Tech_Society: ['id','society_name','designation','phone','email','techfest','tentative_months','_by','_ts'],
  EdTech: ['id','url','_by','_ts'],
  Student_Community: ['id','name','notes','email','phone','strength','_by','_ts'],
  Startup: ['id','website','linkedin_post','country','_by','_ts'],
  Attendance: ['id','name','action','notes','session_id','_by','_ts'],
  Attendance_Summary: ['date','name','first_check_in','last_check_out','total_minutes'],
};

function doGet(e){ return handle(e); }
function doPost(e){ return handle(e); }

function handle(e){
  try{
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : (e.parameter||{});
    const action = body.action;
    const tab = normalize(body.tab);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    ensureSheet(ss, tab);

    if(action === 'append'){
      const cols = COLUMNS[tab];
      const sheet = ss.getSheetByName(tab);
      const row = cols.map(k => valueFor(k, body));
      sheet.appendRow(row);
      if(tab === 'Attendance'){ updateAttendanceSummary_(ss, body); }
      return json_({ ok:true, id: body.id });
    }

    if(action === 'delete'){
      const sheet = ss.getSheetByName(tab);
      const idCol = COLUMNS[tab].indexOf('id') + 1;
      const rng = sheet.getDataRange().getValues();
      for(let r=2;r<=rng.length;r++){
        if(String(sheet.getRange(r,idCol).getValue()) === String(body.id)){
          sheet.deleteRow(r);
          return json_({ ok:true, id: body.id });
        }
      }
      return json_({ ok:false, error:'not_found' });
    }

    if(action === 'list'){
      const target = (tab==='attendance_summary') ? 'Attendance_Summary' : tab;
      const sheet = ss.getSheetByName(target);
      const cols = COLUMNS[target];
      const values = sheet.getDataRange().getValues();
      const rows = values.slice(1).map(arr => {
        const o = {}; cols.forEach((k,i)=>o[k]=arr[i]); return o;
      });
      return json_({ ok:true, rows });
    }

    return json_({ ok:false, error:'unknown_action' });
  } catch(err){
    return json_({ ok:false, error: String(err) });
  }
}

function valueFor(k, body){
  if(k==='id') return body.id||'';
  if(k==='_by') return body.meta?.by||'';
  if(k==='_ts') return body.meta?.ts||new Date().toISOString();
  if(k==='session_id'){
    if(body.tab==='attendance'){
      const date = new Date().toISOString().slice(0,10);
      return body.values?.name ? `${date}::${body.values.name}` : '';
    }
    return '';
  }
  return body.values?.[k] ?? '';
}

function updateAttendanceSummary_(ss, body){
  const name = body.values?.name || '';
  const action = String(body.values?.action||'').toLowerCase();
  const ts = body.meta?.ts ? new Date(body.meta.ts) : new Date();
  const dateKey = ts.toISOString().slice(0,10);

  ensureSheet(ss, 'Attendance_Summary');

  const att = ss.getSheetByName('Attendance');
  const cols = COLUMNS.Attendance;
  const rows = att.getDataRange().getValues().slice(1).map(a=>{
    const o={}; cols.forEach((k,i)=>o[k]=a[i]); return o;
  }).filter(r => r.name===name && String(r._ts).slice(0,10)===dateKey)
    .sort((a,b)=> new Date(a._ts) - new Date(b._ts));

  let totalMs = 0, firstIn='', lastOut='';
  let lastIn = null;
  rows.forEach(r=>{
    const act = String(r.action||'').toLowerCase();
    if(act==='check_in'){
      if(!firstIn) firstIn = r._ts;
      lastIn = new Date(r._ts);
    } else if(act==='check_out'){
      lastOut = r._ts;
      if(lastIn){ totalMs += (new Date(r._ts) - lastIn); lastIn = null; }
    }
  });

  const sum = ss.getSheetByName('Attendance_Summary');
  const headers = COLUMNS.Attendance_Summary;
  const values = sum.getDataRange().getValues();
  const dateCol = headers.indexOf('date')+1;
  const nameCol = headers.indexOf('name')+1;

  let rowIndex = -1;
  for(let r=2;r<=values.length;r++){
    const d = sum.getRange(r, dateCol).getValue();
    const n = sum.getRange(r, nameCol).getValue();
    if(String(d)===dateKey && String(n)===name){ rowIndex = r; break; }
  }
  const upd = [dateKey, name, firstIn||'', lastOut||'', Math.round(totalMs/60000)];
  if(rowIndex<0){ sum.appendRow(upd); }
  else { sum.getRange(rowIndex,1,1,upd.length).setValues([upd]); }
}

function ensureSheet(ss, name){
  const resolved = (name==='attendance_summary') ? 'Attendance_Summary' : name;
  if(!ss.getSheetByName(resolved)){
    const cols = COLUMNS[resolved] || ['id','_by','_ts'];
    const sh = ss.insertSheet(resolved);
    sh.getRange(1,1,1,cols.length).setValues([cols]);
    sh.setFrozenRows(1);
  }
}

function normalize(id){
  const map = {
    tech_society:'Tech_Society',
    edtech:'EdTech',
    student_community:'Student_Community',
    startup:'Startup',
    attendance:'Attendance',
    attendance_summary:'Attendance_Summary',
  };
  return map[id]||id;
}

function json_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
