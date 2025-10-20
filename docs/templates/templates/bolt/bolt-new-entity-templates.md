# 🏗️ **Bolt.new Entity Templates**

**Ready-to-use templates for common entity types in backend APIs.**

---

## 📋 **Common Entity Types**

### **1. User Management**
```
Add user management system to the backend:

**User Entity**:
- id (UUID, primary key)
- email (string, unique, required)
- password (string, hashed, required)
- firstName (string, required)
- lastName (string, required)
- role (enum: admin, user, guest)
- isActive (boolean, default true)
- emailVerified (boolean, default false)
- profileImage (string, optional)
- phone (string, optional)
- dateOfBirth (date, optional)
- address (string, optional)
- createdAt (datetime)
- updatedAt (datetime)

**User Routes**:
- GET /api/users (list with pagination, search, role filter)
- GET /api/users/:id (get user profile)
- POST /api/users (create user - admin only)
- PUT /api/users/:id (update user)
- DELETE /api/users/:id (deactivate user)
- POST /api/users/:id/activate (activate user)
- POST /api/users/:id/change-role (change user role)

**Validation Rules**:
- email: required, valid email format, unique
- password: required, min 8 chars, must contain uppercase, lowercase, number
- firstName: required, min 2 chars, max 50 chars
- lastName: required, min 2 chars, max 50 chars
- phone: optional, valid phone format
- role: required, must be valid enum value

Generate complete user management system with all features.
```

### **2. Content Management**
```
Add content management system to the backend:

**Content Entity**:
- id (UUID, primary key)
- title (string, required)
- content (text, required)
- slug (string, unique, auto-generated)
- excerpt (string, optional)
- featuredImage (string, optional)
- status (enum: draft, published, archived)
- contentType (enum: article, page, news, event)
- tags (array of strings)
- category (string, optional)
- authorId (UUID, foreign key to User)
- publishedAt (datetime, optional)
- views (integer, default 0)
- likes (integer, default 0)
- createdAt (datetime)
- updatedAt (datetime)

**Content Routes**:
- GET /api/content (list with pagination, search, filter by status/type)
- GET /api/content/:slug (get by slug)
- GET /api/content/:id (get by ID)
- POST /api/content (create content)
- PUT /api/content/:id (update content)
- DELETE /api/content/:id (delete content)
- POST /api/content/:id/publish (publish content)
- POST /api/content/:id/like (like content)
- GET /api/content/categories (get all categories)
- GET /api/content/tags (get all tags)

**Validation Rules**:
- title: required, min 3 chars, max 200 chars
- content: required, min 10 chars
- slug: auto-generated from title, unique
- status: required, must be valid enum
- contentType: required, must be valid enum
- tags: optional, array of strings, max 10 tags
- category: optional, max 50 chars

Generate complete content management system with all features.
```

### **3. E-commerce Products**
```
Add e-commerce product management to the backend:

**Product Entity**:
- id (UUID, primary key)
- name (string, required)
- description (text, required)
- sku (string, unique, auto-generated)
- price (decimal, required)
- comparePrice (decimal, optional)
- cost (decimal, optional)
- status (enum: active, inactive, out_of_stock)
- category (string, required)
- brand (string, optional)
- weight (decimal, optional)
- dimensions (json: length, width, height)
- images (array of strings)
- tags (array of strings)
- inventory (integer, default 0)
- lowStockThreshold (integer, default 5)
- isDigital (boolean, default false)
- requiresShipping (boolean, default true)
- taxCategory (string, optional)
- seoTitle (string, optional)
- seoDescription (string, optional)
- createdAt (datetime)
- updatedAt (datetime)

**Product Routes**:
- GET /api/products (list with pagination, search, filter by category/status)
- GET /api/products/:id (get product)
- GET /api/products/sku/:sku (get by SKU)
- POST /api/products (create product)
- PUT /api/products/:id (update product)
- DELETE /api/products/:id (delete product)
- POST /api/products/:id/images (upload images)
- DELETE /api/products/:id/images/:imageId (delete image)
- GET /api/products/categories (get all categories)
- GET /api/products/brands (get all brands)
- POST /api/products/:id/inventory (update inventory)

**Validation Rules**:
- name: required, min 3 chars, max 200 chars
- description: required, min 10 chars
- price: required, positive number, max 2 decimal places
- comparePrice: optional, positive number, must be > price
- cost: optional, positive number
- category: required, max 100 chars
- brand: optional, max 100 chars
- weight: optional, positive number
- inventory: required, non-negative integer
- images: optional, array of valid image URLs

Generate complete product management system with all features.
```

### **4. Event Management**
```
Add event management system to the backend:

**Event Entity**:
- id (UUID, primary key)
- title (string, required)
- description (text, required)
- eventType (enum: conference, workshop, meeting, social, other)
- startDate (datetime, required)
- endDate (datetime, required)
- timezone (string, required)
- location (string, optional)
- address (string, optional)
- city (string, optional)
- country (string, optional)
- isVirtual (boolean, default false)
- virtualLink (string, optional)
- maxAttendees (integer, optional)
- currentAttendees (integer, default 0)
- registrationRequired (boolean, default false)
- registrationDeadline (datetime, optional)
- price (decimal, default 0)
- currency (string, default 'USD')
- status (enum: draft, published, cancelled, completed)
- featuredImage (string, optional)
- tags (array of strings)
- organizerId (UUID, foreign key to User)
- createdAt (datetime)
- updatedAt (datetime)

**Event Routes**:
- GET /api/events (list with pagination, search, filter by type/status/date)
- GET /api/events/:id (get event)
- POST /api/events (create event)
- PUT /api/events/:id (update event)
- DELETE /api/events/:id (delete event)
- POST /api/events/:id/register (register for event)
- DELETE /api/events/:id/register (unregister from event)
- GET /api/events/:id/attendees (get attendees)
- POST /api/events/:id/publish (publish event)
- GET /api/events/upcoming (get upcoming events)
- GET /api/events/past (get past events)

**Validation Rules**:
- title: required, min 3 chars, max 200 chars
- description: required, min 10 chars
- startDate: required, valid datetime, must be in future
- endDate: required, valid datetime, must be after startDate
- timezone: required, valid timezone
- maxAttendees: optional, positive integer
- price: optional, non-negative number
- registrationDeadline: optional, must be before startDate

Generate complete event management system with all features.
```

### **5. Task/Project Management**
```
Add task and project management to the backend:

**Project Entity**:
- id (UUID, primary key)
- name (string, required)
- description (text, optional)
- status (enum: planning, active, on_hold, completed, cancelled)
- priority (enum: low, medium, high, urgent)
- startDate (date, optional)
- endDate (date, optional)
- budget (decimal, optional)
- currency (string, default 'USD')
- clientId (UUID, foreign key to User, optional)
- projectManagerId (UUID, foreign key to User)
- teamMembers (array of UUIDs)
- tags (array of strings)
- progress (integer, default 0, max 100)
- createdAt (datetime)
- updatedAt (datetime)

**Task Entity**:
- id (UUID, primary key)
- title (string, required)
- description (text, optional)
- status (enum: todo, in_progress, review, completed, cancelled)
- priority (enum: low, medium, high, urgent)
- projectId (UUID, foreign key to Project)
- assigneeId (UUID, foreign key to User, optional)
- dueDate (datetime, optional)
- estimatedHours (decimal, optional)
- actualHours (decimal, default 0)
- dependencies (array of UUIDs)
- tags (array of strings)
- createdAt (datetime)
- updatedAt (datetime)

**Project Routes**:
- GET /api/projects (list with pagination, search, filter by status)
- GET /api/projects/:id (get project)
- POST /api/projects (create project)
- PUT /api/projects/:id (update project)
- DELETE /api/projects/:id (delete project)
- GET /api/projects/:id/tasks (get project tasks)
- POST /api/projects/:id/tasks (create task)
- GET /api/projects/:id/team (get team members)
- POST /api/projects/:id/team (add team member)
- DELETE /api/projects/:id/team/:userId (remove team member)

**Task Routes**:
- GET /api/tasks (list with pagination, search, filter by status/project)
- GET /api/tasks/:id (get task)
- POST /api/tasks (create task)
- PUT /api/tasks/:id (update task)
- DELETE /api/tasks/:id (delete task)
- POST /api/tasks/:id/assign (assign task)
- POST /api/tasks/:id/complete (mark as completed)
- GET /api/tasks/my-tasks (get current user's tasks)
- GET /api/tasks/overdue (get overdue tasks)

**Validation Rules**:
- Project name: required, min 3 chars, max 200 chars
- Task title: required, min 3 chars, max 200 chars
- endDate: optional, must be after startDate
- progress: integer between 0 and 100
- estimatedHours: optional, positive number
- actualHours: optional, non-negative number

Generate complete project and task management system with all features.
```

### **6. Blog/News System**
```
Add blog and news management to the backend:

**Post Entity**:
- id (UUID, primary key)
- title (string, required)
- slug (string, unique, auto-generated)
- content (text, required)
- excerpt (text, optional)
- featuredImage (string, optional)
- status (enum: draft, published, archived)
- postType (enum: blog, news, announcement)
- category (string, required)
- tags (array of strings)
- authorId (UUID, foreign key to User)
- publishedAt (datetime, optional)
- views (integer, default 0)
- likes (integer, default 0)
- commentsEnabled (boolean, default true)
- isFeatured (boolean, default false)
- seoTitle (string, optional)
- seoDescription (string, optional)
- createdAt (datetime)
- updatedAt (datetime)

**Comment Entity**:
- id (UUID, primary key)
- postId (UUID, foreign key to Post)
- authorId (UUID, foreign key to User)
- content (text, required)
- parentId (UUID, foreign key to Comment, optional)
- status (enum: pending, approved, rejected)
- likes (integer, default 0)
- createdAt (datetime)
- updatedAt (datetime)

**Post Routes**:
- GET /api/posts (list with pagination, search, filter by category/status)
- GET /api/posts/:slug (get by slug)
- GET /api/posts/:id (get by ID)
- POST /api/posts (create post)
- PUT /api/posts/:id (update post)
- DELETE /api/posts/:id (delete post)
- POST /api/posts/:id/publish (publish post)
- POST /api/posts/:id/like (like post)
- GET /api/posts/featured (get featured posts)
- GET /api/posts/categories (get all categories)
- GET /api/posts/tags (get all tags)

**Comment Routes**:
- GET /api/posts/:id/comments (get post comments)
- POST /api/posts/:id/comments (create comment)
- PUT /api/comments/:id (update comment)
- DELETE /api/comments/:id (delete comment)
- POST /api/comments/:id/like (like comment)
- POST /api/comments/:id/approve (approve comment)
- POST /api/comments/:id/reject (reject comment)

**Validation Rules**:
- title: required, min 3 chars, max 200 chars
- content: required, min 10 chars
- slug: auto-generated from title, unique
- category: required, max 100 chars
- tags: optional, array of strings, max 10 tags
- comment content: required, min 1 char, max 1000 chars

Generate complete blog and news management system with all features.
```

---

## 🎯 **Usage Instructions**

1. **Copy the entity template** you need
2. **Customize the fields** for your specific requirements
3. **Add to your main bolt.new prompt** or use as separate prompt
4. **Generate the complete entity system** with all CRUD operations
5. **Test the generated API** endpoints

---

## 💡 **Pro Tips**

1. **Always include audit fields** (createdAt, updatedAt)
2. **Add soft delete support** (deletedAt field)
3. **Include status fields** for workflow management
4. **Add relationship fields** for data connections
5. **Include search and filter capabilities**
6. **Add pagination** for all list endpoints
7. **Include validation rules** for all fields
8. **Add business logic** in service layers

---

**Template Version**: 1.0  
**Last Updated**: September 2025  
**Compatibility**: Any backend project using the main template
