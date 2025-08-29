export const DEFAULT_TABS = [
  {
    id: 'tech_society',
    title: 'Tech Society',
    group: 'Lead Generation',
    fields: [
      { key: 'society_name', label: 'Society Name', type: 'text', required: true },
      { key: 'designation', label: 'Designation', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'tel' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'techfest', label: 'Techfest', type: 'text' },
      { key: 'tentative_months', label: 'Tentative Months', type: 'text' },
    ]
  },
  {
    id: 'edtech',
    title: 'EdTech',
    group: 'Lead Generation',
    fields: [{ key: 'url', label: 'Website URL', type: 'url', required: true }]
  },
  {
    id: 'student_community',
    title: 'Student Community',
    group: 'Lead Generation',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'tel' },
      { key: 'strength', label: 'Approx Strength', type: 'number' },
    ]
  },
  {
    id: 'startup',
    title: 'Startup',
    group: 'Startup',
    fields: [
      { key: 'website', label: 'Website URL', type: 'url', required: true },
      { key: 'linkedin_post', label: 'LinkedIn Post URL', type: 'url' },
      { key: 'country', label: 'Country', type: 'text' },
    ]
  },
  {
    id: 'attendance',
    title: 'Attendance',
    group: 'Operations',
    fields: [
      { key: 'name', label: 'Member Name', type: 'text', required: true },
      { key: 'action', label: 'Action (check_in/check_out)', type: 'text', required: true },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ]
  },
  {
    id: 'attendance_summary',
    title: 'Attendance Summary (Read-only)',
    group: 'Operations',
    readonly: true,
    fields: [
      { key: 'date', label: 'Date', type: 'text' },
      { key: 'name', label: 'Member Name', type: 'text' },
      { key: 'first_check_in', label: 'First Check-in', type: 'text' },
      { key: 'last_check_out', label: 'Last Check-out', type: 'text' },
      { key: 'total_minutes', label: 'Total Minutes', type: 'number' }
    ]
  }
]
