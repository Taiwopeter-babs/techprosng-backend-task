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

- #### Indexing frequently accessed columns
- #### Implementation of a caching system
- #### Creating read replicas
- #### Horizontal/Vertical scaling
