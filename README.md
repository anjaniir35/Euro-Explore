## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add:
    - additional textual content
    - an image added as an external image URL

- [x] **Web app includes a home feed displaying previously created posts**
  - Web app includes a home feed displaying previously created posts
  - By default, each post on the posts feed shows only the post's:
    - creation time
    - title
    - upvotes count
  - Clicking on a post directs the user to a new page for the selected post

- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    - creation time
    - upvotes count
  - Users can search for posts by title

- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page.
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [x] **Web app implements pseudo-authentication**
  - Upon launching the web app, the user is assigned an anonymous user ID through Supabase authentication.
  - The ID is associated with the posts and comments they create.
  - Only the original author can edit or delete their posts.
  - Users can delete their own comments.

- [x] **Users can repost a previous post by referencing its post ID**
  - Users can repost a previous post by referencing its post ID.
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread.

- [x] **Users can customize the interface**
  - Users can choose whether to show post content and images on the home feed.
  - The app features a coordinated pastel color scheme.

- [x] **Users can add more characteristics to their posts**
  - Users can share and view web videos.
  - Users can set categories such as "Question" or "Opinion" while creating a post.
  - Users can filter posts by category on the home feed.
  - Users can upload images directly from their local machine as an image file.

- [x] Web app displays a loading animation whenever data is being fetched.

The following **additional** features are implemented:

- [x] European destination discovery page with city cards.
- [x] Search destinations by city or country.
- [x] Filter destinations by region.
- [x] Individual city detail pages with Wikipedia descriptions and links.
- [x] Related city recommendations based on region.
- [x] Responsive design for different screen sizes.
- [x] Custom homepage featuring a hero section and featured destinations.
- [x] Navigation bar connecting Home, Destinations, and Community.
- [x] Supabase database integration for storing posts, comments, and destinations.
- [x] Supabase Storage integration for uploaded post images.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='' title='Video Walkthrough' width='' alt='Video Walkthrough' />

## Notes

One of the main challenges encountered while building EuroExplore was integrating the community posting features with the destination discovery experience. Connecting React components to Supabase required managing database operations, user authentication, image uploads, and post.