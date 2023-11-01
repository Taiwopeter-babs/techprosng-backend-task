# Database Optimization Strategy

This documentation proposes, in detail, an optimization strategy for an online learning platform `OLearn`. `OLearn` uses a MySQL database platform for storing user data. The goal is to highlight various optimization startegies for the database which has experienced a spike in data read and write queries.

### Contents

- [Situation](#situation)
- [Proposal](#proposal)
  - [Indexing of columns](#index-frequently-accessed-columns)
  - [Caching](#implement-of-a-caching-system)
  - [Create read replicas](#create-read-replicas)
  - [Scaling](#scaling)

## Situation

The existing MySQL database worked well for 150,000 users during the first quarter of the year, but by the third quarter, the amount of registered users and daily active users quadrupled. We now had 600,000 users accessing the database weekly. This led slower response from the backend services which, in no small measure, was accounted for by the enormous read and write queries on the database.

After investigating, three major bottlenecks were identified:

- Non-indexed frequently accessed columns
- Absence of caching middleware for MRU (Most Recently Used) queries
- Read and Write requests on the same database server.

## Proposal

After considering the major bottlenecks identified, four strategies have been highlighted:

- ### Index frequently accessed columns

The _userId_ and _userEmail_ columns were identified to have the most frequent access in terms of; retrieval of users' data and authentication of users. Two instances are possible:

- Separately index the _userId_ and _userEmail_ columns or;
- Use a single index for both columns.

Due to the bottlenecks highlighted above, the first option would suffice. Although, this would use more disk space as compared to combining the index of two columns. The reason for this is due to the queries on the database. Most queries involving the _userId_ column use just the _userId_ and the same goes for the _userEmail_.

Consider the following query on the `users` table:

```sql
-- query the 'users' table for a specific user

-- select the database table
USE olearn_db;

-- query user with specified userId
SELECT userId FROM users WHERE userId = '342h8-4332-olearn';
```

The above query is an example of queries frequently used. Only in required circumstances are two columns combined, which would have justified the usage of the combined index.

An example query that creates an index on `userEmail` column in the `users` table

```sql
-- create an index for `userEmail`
USE olearn_db;

CREATE INDEX idx_user_email ON users(userEmail);
```

Of course, this would not matter if the database server is hosted on a machine with enough compute resources. Still, it is reasonable to consider the effect many indexes might have on a single database if not required. But for this case, separately indexing the columns was useful.

- ### Implement a caching system
  Utilizing a cache memory, like redis, to store the most recently accessed query results will improve response times, and ultimately improve query performance. To actualize this, a middleware layer is put in place so that every HTTP `GET` request paases through it to first check the cache memory for the requested resource, and only if the resource is unavailable, then the database is queried.

The example below uses the JavaScript express framework to actualize this:

```js
const express = require("express");

// initialize the express instance
const app = express();

app.use("/api/v3");

const checkCacheMiddleware = (req, res, next) => {
  // logic to check redis cache
  // if resource is not in cache
  next();
  // otherwise serialize resource and send
  res.status(200).json({ ...resource });
};

app.get("/users/:userId", checkCacheMiddleware, (req, res) => {
  // check database for userId, 404 status is returned if not found
  // return resource
  res.status(200).json({ ...userObj });
});

app.listen(3000, () => {
  console.log(`Express server is on port ${port}`);
});
```

- ### Create read replicas

Two database servers can be set up on two different machines. Database A will function as the primary database, the master, which every new write request (INSERT, UPDATE, and DELETE queries) will be directed to. Database B, which is a replica, will have all read requests directed to it.

New write requests will always go to the master, database A, before copy takes place on the replica, where all read requests go directly and exclusively to. This way, even if Kehinde, a learner who wants to take a course on mathematics, registers today and his data is written to the master database at the same time a long time learner, Zainab, wants to login, two different databases are serving them on the same platform.

This will significantly reduce latency in response and improve query performance.

- ## Scaling

Depending on the budget allowed for this process, the choice of either scaling method will be determined by the compute resources of the host machine(s). To save cost, a single host machine with enough compute resources will host the database, then vertically scaled.

### Vertical Scaling

The process involves separating columns into separate tables on the same host machine, but separated columns share the primary key column. Consider the `users` table; `userId`, `fullName`, and `userEmail` can be partitioned into two tables having `userId` and `fullName` in the first table, and the second table containing `userId` and `userEmail`.

#### Original `users` Table

| userId | userEmail           | fullName         |
| ------ | ------------------- | ---------------- |
| 1      | userone@email.com   | Zainab Aliu      |
| 2      | usertwo@email.com   | Kehinde Samuel   |
| 3      | userthree@email.com | Precious Alle    |
| 4      | userfour@email.com  | Muhammed Nketiah |
| 5      | userfive@email.com  | Justice Emeka    |

#### Table One after partitioning

| userId | userEmail           |
| ------ | ------------------- |
| 1      | userone@email.com   |
| 2      | usertwo@email.com   |
| 3      | userthree@email.com |
| 4      | userfour@email.com  |
| 5      | userfive@email.com  |

#### Table Two after partitioning

| userId | userEmail        |
| ------ | ---------------- |
| 1      | Zainab Aliu      |
| 2      | Kehinde Samuel   |
| 3      | Precious Alle    |
| 4      | Muhammed Nketiah |
| 5      | Justice Emeka    |
