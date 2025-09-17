import pypandoc

# Markdown content
markdown_content = """# Task Management System Specification

## Refined Prompt for Programming AI  

We are building the **“Tasks” section** of the website. Please implement the following functionality:  

### 1. Task Creation  
- Add a **“Create Task”** button.  
- When clicked, open a **modal window** with a task creation form.  
- Fields in the form:  
  - **Task Name**: Text input (title of the task).  
  - **Task Description**: Text area (details of what needs to be done).  
  - **Task Priority**: Dropdown with 3 options:  
    - Red = High Priority  
    - Orange = Medium Priority  
    - Green = Low Priority  
  - **Task Risk**: Dropdown with 4 options:  
    - Black = Dangerous  
    - Red = High Risk  
    - Orange = Medium Risk  
    - Green = Low Risk  
  - **Assigned Staff**: Multi-select dropdown populated with existing user accounts. Multiple users can be assigned.  
  - **Deadline**: Date picker. Show a **countdown** to the deadline. If overdue, flag the task as **Overdue**.  
  - **Comments & Updates**: Allow logged-in users to add updates. Each update should display:  
    - Username of the poster  
    - Text comment  
    - Ability to upload **media files** (images/videos) and **documents**  

### 2. Task Display  
- Add a **Task List** viewable on the **Dashboard**.  
- Each task should display its fields (Name, Priority, Risk, Assigned Staff, Deadline with countdown, Comments).  
- Allow filtering of tasks by:  
  - Risk  
  - Due Date  
  - Title  

---

## To-Do List for Programming AI  

### 1. Frontend Setup  
- Create “Create Task” button.  
- Build modal window for task creation.  
- Implement form fields (Name, Description, Priority, Risk, Staff assignment, Deadline, Comments).  

### 2. Backend Setup  
- Create database schema/model for tasks with fields:  
  - id, name, description, priority, risk, assigned_users[], deadline, created_at, status (overdue/active), comments[]  
- Link “Assigned Staff” field to existing user accounts.  
- Handle media/document uploads for comments.  

### 3. Deadline Logic  
- Implement countdown to deadline.  
- Mark tasks as **Overdue** if the current date > deadline.  

### 4. Comments & Updates  
- Enable logged-in users to post comments.  
- Display username + timestamp with each comment.  
- Allow uploading media/documents to attach to comments.  

### 5. Task List & Dashboard Integration  
- Display all created tasks on the **Dashboard**.  
- Add filters for: Risk, Due Date, and Title.  
- Ensure tasks update dynamically when new ones are created or edited.  

### 6. UI/UX Enhancements  
- Color-code tasks based on **Priority** and **Risk** for quick visibility.  
- Add hover tooltips explaining risk/priority levels.  
- Make the Dashboard responsive and clean.  
"""

# Save as markdown file using pypandoc
output_path = "/mnt/data/task_management_spec.md"
pypandoc.convert_text(markdown_content, 'md', format='md', outputfile=output_path, extra_args=['--standalone'])

output_path
