# Database Optimization Strategy

This documentation proposes, in detail, an optimization strategy for an online learning platform `OLearn`. `OLearn` uses a MySQL database platform for storing user data. The goal is to highlight various optimization startegies for the database which has experienced a spike in data read and write queries.

### Contents

- [Situation](#situation)
- [Proposal](#proposal)
  - [Indexing of columns](#indexing-frequently-accessed-columns)
  - [Caching](#implementation-of-a-caching-system)
  - [Creating read replica](#creating-read-replicas)
  - [Scaling horizontally or vertically](#horizontalvertical-scaling)

## Situation

The existing MySQL database worked well for 150,000 users during the first quarter of the year, but by the third quarter, the amount of registered users and daily active users quadrupled. We now had 600,000 users accessing the database weekly. This led slower response from the backend services which, in no small measure, was accounted for by the enormous read and write queries on the database.

After investigating, three major bottlenecks were identified:

- Non-indexed frequently accessed columns
- Absence of caching middleware for MRU (Most Recently Used) queries
- Read and Write requests on the same database server.

## Proposal

After considering the major bottlenecks identified, four strategies have been highlighted:

- ### Indexing frequently accessed columns

  The _userId_ and _userEmail_ columns were identified to have the most frequent access in terms of; retrieval of users' data and authentication of users. Two instances are possible:

  - Separately index the _userId_ and _userEmail_ columns or
  - Use a single index for both columns.
    Due to the bottlenecks highlighted above, the first option would suffice. Although, this would use more disk space as compared to combining the index of two columns. The reason for this is due to the queries on the database. Most queries involving the _userId_ column use just the _userId_ and the same goes for the _userEmail_. For example:

    ```sql
    -- query the 'users' table for a specific user

    -- select the database table
    USE olearn_db;

    -- query user with specified userId
    SELECT userId FROM users WHERE userId = '342h8-4332-olearn';
    ```

    The above query is an example of

    Of course, this would not matter if the database server is hosted on a machine with a large enough compute resources. Still, it is reasonable to consider the effect many indexes might have on a single database.

- #### Implementation of a caching system
- #### Creating read replicas
- #### Horizontal/Vertical scaling
