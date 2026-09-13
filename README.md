# StudySprint 🚀

> A focused, modern study and task planner built specifically for university students to track coursework, lab assignments, readings, and exam deadlines with real-time Supabase PostgreSQL persistence.

---

## 📖 Table of Contents
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

## 🎯 Project Description

University students often juggle multiple courses, assignments, readings, and exams across disparate schedules. **StudySprint** provides a streamlined, distraction-free study planner that keeps essential coursework organized. 

Unlike complex productivity software bloated with chat, payments, or ads, StudySprint focuses purely on clarity, quick task capture, and persistence via **Supabase PostgreSQL**.

---

## ✨ Features

1. **Dashboard & Study Metrics**:
   - Live metrics calculating **Total Tasks**, **Completed Tasks**, and **Pending Tasks**.
   - Dynamic study progress bar showcasing completion percentage.
2. **Built-in "Study Sprint" Pomodoro Focus Timer**:
   - 25-minute study focus & 5-minute break timer.
   - Link any task from your list directly to the timer (`⚡ Sprint`).
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
   - 🚨 **Overdue** (pulsing badge for past due coursework)
   - ⚡ **Due Today** (highlighting urgent deadlines)
   - ⏳ **Due Tomorrow**
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

## 🛠 Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Language**: JavaScript (ESModules, JSX)
- **Database**: [Supabase PostgreSQL](https://supabase.com/)
- **Database Client**: [`@supabase/supabase-js`](https://github.com/supabase/supabase-js)
- **Styling**: Custom modern CSS with CSS variables, accessible contrast, and Plus Jakarta Sans typography.

---

## 🏗 Architecture

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

## 🗄 Supabase Setup & SQL Schema

### 1. Create a Supabase Project
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project or select an existing one.

### 2. Run the SQL Migration
Open the **SQL Editor** in your Supabase dashboard and execute the following script:

```sql
-- 1. Create the tasks table in public schema
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text not null,
  due_date text not null,
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.tasks enable row level security;

-- 3. Create RLS policy to allow read/write access via the anon key (no auth required)
create policy "Allow all operations for anon" on public.tasks 
  for all 
  using (true) 
  with check (true);
```

> **Note on Primary Key**: StudySprint supports standard `uuid` (using `gen_random_uuid()`) or auto-incrementing `bigint`/`serial` IDs.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Security Warning**: Only use the public `anon` key. Never expose your Supabase `service_role` or secret key in client-side code.

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

## 🚀 Running the Project

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📦 Build Instructions

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

## 🌐 Deployment Instructions

StudySprint can be hosted on any static hosting provider.

### Option A: Deploy to Vercel
1. Install the Vercel CLI (`npm i -g vercel`) or link your GitHub repository on [vercel.com](https://vercel.com).
2. Set the build command to `npm run build` and output directory to `dist`.
3. Add Environment Variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Option B: Deploy to Netlify
1. Connect your repository on [netlify.com](https://netlify.com).
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Under **Site configuration > Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy site!

---

## 🔮 Future Improvements

- **Subject Filtering**: Filter tasks directly by course/subject tag.
- **Sorting Options**: Sort by nearest due date or alphabetically.
- **Calendar View**: Visual monthly calendar view of course deadlines.
- **Export Course Plan**: Export your completed study tasks to PDF or CSV for academic records.
