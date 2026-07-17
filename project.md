Node.js (TypeScript)
Express / Fastify
PostgreSQL
Redis
BullMQ
Kafka
Docker / Podman
OpenTelemetry
Prometheus
Grafana
GitHub Actions
Jest

Phase 0 - Project Setup
Goal

Create a production-style repository.

Topics

Folder structure
Environment configuration
Docker / Podman
PostgreSQL
Redis
Logging
Configuration management
Health checks
Graceful shutdown
Error handling
ESLint
Prettier

Deliverables

Repository setup
Local development environment
CI pipeline
README
Phase 1 - Database Fundamentals

Project

Inventory Management

Topics

Database normalization
Transactions
ACID
Race conditions
Atomic SQL
UPDATE ... WHERE
SELECT FOR UPDATE
Optimistic Locking
Pessimistic Locking
Isolation Levels
Deadlocks
Indexes
Query planning
Explain Analyze

Deliverables

Overselling demo
Fixed implementations
Load test
Phase 2 - Redis Fundamentals

Topics

Strings
Lists
Sets
Sorted Sets
Hashes
Bitmaps
HyperLogLog
Streams
TTL
Expiration
Memory eviction
Pipelines
Transactions
Lua
Redis Cluster
Hash Slots
Hash Tags

Project

Caching Inventory

Phase 3 - Rate Limiting

Topics

Fixed Window
Sliding Window
Sliding Log
Token Bucket
Lua implementation
Redis TIME
Retry-After
Distributed Rate Limiting
API Gateway Rate Limiting

Project

Production Rate Limiter

Phase 4 - Distributed Locks

Topics

Database Locks

Atomic updates
Row locks
FOR UPDATE

Redis Locks

SET NX
PX
Random Token
Lua Unlock
Heartbeat
Lock Renewal
Stale Locks
Redlock
Lock Granularity

Project

Inventory Reservation

Phase 5 - Payment System

This is one of the biggest phases.

Topics

Payment flow
Authorization
Capture
Refund
Webhooks
Signature verification
Duplicate webhook handling
Idempotency Keys
Retry logic
Reconciliation
Payment failures
Partial failures

Project

Mock Payment Gateway

Eventually we can integrate a real sandbox such as Stripe or Razorpay (depending on availability and your preference).

Phase 6 - Background Processing

Topics

BullMQ

Queues
Workers
Delayed Jobs
Retries
Backoff
Dead Letter Queue
Rate Limiting
Concurrency
Priority

Project

Invoice Generation

Phase 7 - Messaging

Topics

Kafka

Topics
Partitions
Consumer Groups
Ordering
Offsets
Rebalancing
Exactly Once
At Least Once
At Most Once

Project

Order Events

Phase 8 - Distributed Transactions

Topics

Saga
Choreography
Orchestration
Compensation
Outbox Pattern
Inbox Pattern
CDC
Debezium (conceptual)

Project

Order + Payment + Inventory

Phase 9 - Caching

Topics

Cache Aside
Write Through
Write Behind
Read Through
Cache Stampede
Cache Avalanche
Cache Penetration

Project

Product Catalog

Phase 10 - WebSockets

Topics

Socket.IO
Redis Adapter
Scaling
Presence
Notifications

Project

Live Order Tracking

Phase 11 - Observability

Topics

Structured Logging
Correlation IDs
Metrics
Tracing
OpenTelemetry
Prometheus
Grafana
Phase 12 - Deployment

Topics

Docker
Podman
GitHub Actions
CI/CD
Reverse Proxy
Nginx
Load Balancer
Phase 13 - System Design

Topics

Design

Uber
WhatsApp
Amazon
Instagram
URL Shortener
Notification System
Payment Platform
Ticket Booking
Continuous Topics

These are learned throughout the project rather than in isolation.

Clean Code
Refactoring
SOLID
Design Patterns
Testing
Security
Performance
API Design
Authentication
Authorization
Documentation
Code Reviews
Interview Preparation

After every phase we'll cover:

Common interview questions
Production incidents
Trade-offs
Alternative solutions
When NOT to use the technology
Resume talking points
Git Strategy

One feature per branch.

One concept per pull request.

Meaningful commits like:

feat(db): implement atomic inventory update

feat(redis): add distributed token bucket

feat(lock): implement SET NX PX lock

fix(lock): prevent stale lock release using Lua

feat(queue): invoice generation with BullMQ
What we'll build by the end

A production-style Distributed Order Processing Platform with:

Inventory management
Payments
Distributed locking
Background workers
Event-driven communication
Notifications
Observability
Deployment pipeline
How I'd like to mentor you

I'd like each topic to follow the same cycle:

Problem – Start with a real production problem.
Naive solution – Build the simplest implementation.
Break it – Reproduce race conditions, failures, and bottlenecks.
Improve it – Introduce the next concept to solve the problem.
Production discussion – Explore trade-offs, alternatives, and common interview questions.
Commit – Push a clean, well-documented implementation to GitHub.
Update the roadmap – Mark the topic complete and record key learnings.

This way, every concept has a reason to exist rather than feeling like a feature you memorized.

One last thing: I also want us to occasionally simulate production incidents—database deadlocks, Redis outages, Kafka consumer crashes, duplicate payment webhooks, network timeouts, cache stampedes, and similar failures. Knowing how to build a system is important, but knowing how to debug and recover from failures is what really distinguishes experienced backend engineers. We'll make those failure scenarios part of the learning journey rather than an afterthought.