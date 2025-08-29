
# AceInt LeadGen Dashboard v3

Vite + React + Tailwind. Writes to Google Sheets via Apps Script Web App.

## Master spreadsheet
Create Google Sheet **AceInt_Master** with tabs and columns:

- **Tech_Society**: `id, society_name, designation, phone, email, techfest, tentative_months, _by, _ts`
- **EdTech**: `id, url, _by, _ts`
- **Student_Community**: `id, name, notes, email, phone, strength, _by, _ts`
- **Startup**: `id, website, linkedin_post, country, _by, _ts`
- **Attendance**: `id, name, action, notes, session_id, _by, _ts`
- **Attendance_Summary**: `date, name, first_check_in, last_check_out, total_minutes`
- **Meta_Tabs** (optional): `id, group, title, fields_json`

## Apps Script
- File: `apps_script/Code.gs`. Paste into a new Apps Script project.
- Set `SHEET_ID` to your sheet ID.
- Deploy as **Web app** → Execute as **Me** → Who has access **Anyone**.
- Copy the Web App URL.

## Frontend
- Copy `.env.example` to `.env`
- Set `VITE_GAS_URL=<your Web App URL>`
- `npm i`
- `npm run dev` to test
- Push to GitHub → Vercel import
  - Build: `npm run build`
  - Output dir: `dist`
  - Env var: `VITE_GAS_URL`

## Roles
- Admin password `2222`: create tabs, add, delete
- Prisha password `1111`: add, delete

## Built-in tabs
- Tech Society, EdTech, Student Community, Startup, Attendance, Attendance Summary (read-only).

## Notes
- Admin can dynamically add tabs. New tabs are stored in browser `localStorage`.
