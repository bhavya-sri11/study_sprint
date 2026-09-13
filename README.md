# StudySprint 

> A focused, modern study and task planner built specifically for university students to track coursework, lab assignments, readings, and exam deadlines with real-time Supabase PostgreSQL persistence.

---

## Link of the Project (Deployed through Vercel)
https://study-sprint-cyan.vercel.app/

##  Table of Contents
- [Project Description](#-project-description)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Supabase Setup & SQL Schema](#-supabase-setup--sql-schema)
- [Environment Variables](#-environment-variables)
- [Local Installation](#-local-installation)
- [Running the Project](#-running-the-project)
- [Build Instructions](#-build-instructions)
- [Deployment Instructions](#-deployment-instructions)
- [Future Improvements](#-future-improvements)

---

##  Project Description

University students often juggle multiple courses, assignments, readings, and exams across disparate schedules. **StudySprint** provides a streamlined, distraction-free study planner that keeps essential coursework organized. 

Unlike complex productivity software bloated with chat, payments, or ads, StudySprint focuses purely on clarity, quick task capture, and persistence via **Supabase PostgreSQL**.

---

##  Features

1. **Dashboard & Study Metrics**:
   - Live metrics calculating **Total Tasks**, **Completed Tasks**, and **Pending Tasks**.
   - Dynamic study progress bar showcasing completion percentage.
2. **Built-in "Study Sprint" Pomodoro Focus Timer**:
   - 25-minute study focus & 5-minute break timer.
   - Link any task from your list directly to the timer (`Sprint`).
   - Web Audio API notification chime when the sprint completes.
3. **Interactive Academic Calendar View**:
   - Seamlessly toggle between **List View** and **Academic Calendar View**.
   - Monthly calendar grid with course badges and assignment dots on due dates.
   - Click any calendar day to inspect and manage assignments due on that date.
4. **Task Creation Form**:
   - Required fields: **Task Title**, **Subject / Course**, and **Due Date**.
   - University subject auto-complete suggestions.
   - Real-time client-side validation with field-specific error messages.
5. **Smart Filtering, Search & Sorting**:
   - **Real-Time Search**: Search by task title, course keyword, or topic.
   - **Course Filter Pills**: Clickable subject pills with task counts and color-coding.
   - **Multi-Criteria Sorting**: Closest Due Date, Furthest Due Date, Subject (A-Z), Title (A-Z), Recently Created.
6. **Smart Urgency Badges**:
   -  **Overdue** (pulsing badge for past due coursework)
   -  **Due Today** (highlighting urgent deadlines)
   -  **Due Tomorrow**
7. **One-Click Calendar & Data Export**:
   - **iCalendar (.ics)**: Import study deadlines directly into Google Calendar, Apple Calendar, or Microsoft Outlook.
   - **CSV Export**: Download tasks as a spreadsheet for academic tracking.
8. **Interactive Task Management (Supabase CRUD)**:
   - **Create**: Add new coursework directly to the Supabase database.
   - **Read**: Fetch and display tasks sorted chronologically.
   - **Update**: Toggle tasks between Pending and Completed with instant state sync.
   - **Delete**: Remove tasks permanently from the database.
9. **State Handling**:
   - **Loading State**: Animated spinner and skeleton loaders while communicating with the database.
   - **Empty State**: Friendly illustration and encouragement when no tasks are scheduled.
   - **Error State**: Informative error banners with a "Try Again" retry action.
   - **Setup Guide**: Built-in interactive guidance if credentials need configuration in `.env`.
10. **Modern, Responsive Design**:
   - Built with responsive CSS (Flexbox & CSS Grid).
   - Tailored for laptops, tablets, and smartphones.

---

##  Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Language**: JavaScript (ESModules, JSX)
- **Database**: [Supabase PostgreSQL](https://supabase.com/)
- **Database Client**: [`@supabase/supabase-js`](https://github.com/supabase/supabase-js)
- **Styling**: Custom modern CSS with CSS variables, accessible contrast, and Plus Jakarta Sans typography.

---

##  Architecture

```
studysprint/
├── .env.example              # Template for Supabase environment variables
├── .env                      # Local environment configuration (gitignored)
├── .gitignore                # Git ignore configuration (protects .env)
├── index.html                # HTML entry point with web fonts
├── package.json              # Project dependencies & scripts
├── vite.config.js            # Vite bundler configuration
├── README.md                 # Comprehensive project documentation
└── src/
    ├── main.jsx              # React application root render
    ├── App.jsx               # Application controller, view mode & Supabase CRUD logic
    ├── index.css             # Unified modern CSS design system
    ├── supabaseClient.js     # Supabase client initialization & validation
    ├── utils/
    │   ├── exportUtils.js    # iCalendar (.ics) and CSV export generators
    │   └── subjectColors.js  # Deterministic course color badge palette generator
    └── components/
        ├── Dashboard.jsx     # Brand header, metric cards, & progress bar
        ├── PomodoroTimer.jsx # 25m Focus Sprint / 5m Break timer with task linking
        ├── CalendarView.jsx  # Interactive monthly academic calendar with day inspection
        ├── TaskForm.jsx      # New task form with field validation
        ├── TaskList.jsx      # Search, sort, course pills, & filterable task grid
        ├── TaskItem.jsx      # Task card with urgency badge, subject color, toggle & delete
        └── StateViews.jsx    # Loading, Empty, Error, and Setup notice views
```

---







## 💻 Local Installation

Ensure you have [Node.js](https://nodejs.org/) (version 18+ recommended) installed.

1. Navigate to the project directory:
   ```bash
   cd studysprint
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

##  Running the Project

Start the local development server:

```bash
npm run dev
```

---

##  Build Instructions

To build StudySprint for production:

```bash
npm run build
```

This generates an optimized static bundle in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---


