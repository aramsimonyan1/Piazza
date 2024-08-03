# Cloud Computing Concepts Coursework

## 1. Development of a Cloud Software as a Service 
###
    The coursework aims to make you apply the concepts and software development methods and frameworks seen in class to develop a Cloud Software as a Service (SaaS).
    • You will need to install, develop, test and deploy a Cloud SaaS in virtualised environments, such as VMs, containers and Kubernetes, as per the guidelines described in this document.
    • Upload your final scripts and a technical report to describe the functionality of your solution following the guidelines of the coursework brief document.

## 2. The Piazza system
You must develop a RESTful SaaS for a Twitter-like system called Piazza. In Piazza, users post messages for a particular topic while others browse posts, e.g., per topic and perform fundamental interactions, including liking, disliking, or adding a comment. You should install, test, and document your developments.

Piazza should support the following actions.
Action 1: Authorised users access the Piazza API using the oAuth v2 protocol to perform any interaction.
Action 2: Authorised users post a message for a particular topic in the Piazza API.
Action 3: Registered users browse messages per topic using the Piazza API.
Action 4: Registered users perform basic operations, including “like”, “dislike”, or “comment” a message posted for a topic.
Action 5: Authorised users could browse for the most active post per topic with the highest likes and dislikes.
Action 6: Authorised users could browse the history data of expired posts per topic.

You recommended using the Node.js Express package and MongoDB to develop your software

## 3. Enforcing authentication/verification functionalities
• Your service should include user management and JWT functionality using NodeJS.
    The JWT will authorise the auctioning RESTful API to store data for authorised users in your database.
    You can use a MongoDB database for storing data required in the coursework, as shown in the labs.
• Your code should authenticate users each time you perform any action point of the following Part C, for example, whenever users post, interact, or browse messages.
    Unauthorised users are not allowed to access your resources and perform database requests.
• Any user input should follow a verification process for validation purposes. You are encouraged to improvise and apply your validations.

## 4. Development of Piazza RESTful APIs
• Your APIs should allow the basic functionalities provided in the Action points of Section 2.
• Each post on the Piazza wall should include the following data:
    ¨ The post identifier.
    ¨ The title of a post.
    ¨ The topic of a post from one of the following four categories: Politics, Health, Sport or Tech. Each post could belong to one or more topics.
    ¨ A timestamp of the post-registration in the Piazza API.
    ¨ The message body of a post.
    ¨ The post-expiration time. After the end of this time, the message will remain on the Piazza wall, but it will not accept any further actions, e.g. (likes, dislikes, or comments).
    ¨ The status of a post could be “Live” or “Expired”.
    ¨ Information about the post owner (e.g., a name).
    ¨ The number of likes, dislikes, or a list of comments, if any.
    ¨ Any other information you might need to store essential for your project.
• Each user interaction with a post on a topic (like, dislike or comment) should include the following data:
    ¨ Information about the user interacting with the post of a topic (e.g., a name).
    ¨ The interaction value (including a like, a dislike, or a comment made).
    ¨ The time left for a post to expire.
    ¨ Any other information you can store essential for your project.
• You are encouraged to develop your database collections and application logic
• Consider the following.
    ¨ Only authorised users should access the API.
    ¨ The API should allow any registered user to perform posts.
    ¨ You are encouraged to set any other constraints to improve the software's functionality.
    ¨ You are encouraged to improvise and develop any functionality you like.

## 5. Deploy your Piazza project into a VM using Docker
Upload your code to a GitHub repo and then deploy it in a Google Cloud VM. Provide a list of commands in the report and screenshots to demonstrate your deployment actions. As an alternative, you can use DockerHub.