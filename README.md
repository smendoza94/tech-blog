# Tech-Blog

## Description

Developers spend plenty of time creating new applications and debugging existing codebases, but most developers also spend at least some of their time reading and writing about technical concepts, recent advancements, and new technologies.

A CMS-style blog site similar to a Wordpress site, where developers can publish their blog posts and comment on other developers’ posts as well.

## Developer Technical Aspects

This site is built completely from scratch and deployed it to Heroku. This app will follow the MVC paradigm in its architectural structure, using Handlebars.js as the templating language, Sequelize as the ORM, and the express-session npm package for authentication.

## User Story

AS A developer who writes about tech, I WANT a CMS-style blog site, SO THAT I can publish articles, blog posts, and my thoughts and opinions.

# Node Packages include

1. The Express-Handlebars package, to use Handlebars.js in Views
2. The MySQL2 package, to run SQL database commands
3. Sequelize package to connect to a MySQL database in Models
4. Express.js API to create url routes in Controllers
5. The dotenv package, to use environment variables
6. The bcrypt package, to hash passwords
7. The express-session and connect-session-sequelize packages, to add authentication
8. The nodemon package, to run the server on localhost
9. The Jest package, to test function outputs

## Demo

![demo thumbnail](/assets/img/demo_of_program.gif)

## Acceptance Criteria

- [ ] Default homepage that includes existing blog posts

- [ ] A navigation bar to homepage, dashboard, log in, and log out pages

- [ ] If not logged in, navigation menu does not display, prompted to either sign up or sign in

- [ ] "Sign up" page includes username and password submission credentials are saved and can log into the site

- [ ] "Sign in" page includes entering existing username and password, and will display navigation links for the homepage, dashboard, and log out links

- [ ] "Homepage" presents existing blog posts that include the post title and the date created

- [ ] Logged in users' dashboards are presented with any blog posts they have already created and the option to add a new blog post

- [ ] "Existing blog post" pages present the post title, contents, post creator’s username, and date created for that post and have the option to leave a comment

- [ ] Logged in users can write and submit "comments", the comment is saved and the post is updated to display the comment, the comment creator’s username, and the date created

- [ ] Logged in users can submit new blog posts with a "title" and "content" for the post, then taken back to an updated dashboard with the new blog post

- [ ] "Edit/Update" or "Delete" existing posts in the dashboard

- [ ] "Logout" option in the navigation to signed out of the site

- [ ] "Idle" on the site for more than a set time, comments are displayed but prompted to log in before user can add, update, or delete comments

## License

Refer to [LICENSE](/LICENSE).
