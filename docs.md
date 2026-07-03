Product Requirements Document (PRD)
Project: Paytm Recharge History with Live Transaction Status Polling

Version: 1.0
Prepared By: sq135-Nilgiri
Product: Recharge History System
Platform: Web Application (Next.js + Backend API)
Priority: High

1. Executive Summary

Paytm wants to improve the recharge experience by providing users with a live-updating recharge history where transaction status changes (Pending → Success/Failed) appear automatically without requiring a page refresh.

The system should also allow users to:

View recharge history
Filter transactions by operator and date
Prevent duplicate recharge attempts within 10 seconds
Display real-time transaction status using polling

This feature aims to make recharge tracking faster, more transparent, and prevent accidental duplicate payments.

2. Business Problem Statement
Current Problems

Users currently face several issues after making a recharge:

Recharge status remains outdated until the page is refreshed.
Users are unsure whether a recharge is still processing.
Duplicate recharge attempts are made because users think the first recharge failed.
Searching old transactions is difficult without filters.

These issues increase customer support requests and can lead to financial losses due to duplicate recharges.

Business Goal

Develop a recharge history system that:

Updates transaction status automatically
Prevents duplicate recharge submissions
Allows easy filtering of recharge history
Improves customer confidence and experience
3. Stakeholders
Stakeholder	Responsibility
End Users	Perform recharges and monitor status
Product Manager	Defines requirements
Frontend Developers	Build Recharge History UI
Backend Developers	APIs, polling logic, duplicate prevention
QA Team	Testing
DevOps	Deployment
Customer Support	Handle recharge complaints
4. User Personas
Persona 1 – Daily User
Performs mobile recharge frequently
Wants instant confirmation
Doesn't like refreshing pages repeatedly
Persona 2 – Business User
Makes multiple DTH/Fastag recharges
Needs transaction history
Wants filters for previous recharges
5. Problem Statement

Users need a reliable recharge history system that:

Shows live status updates
Prevents accidental duplicate recharges
Allows quick search of previous transactions

without manually refreshing the page.

6. Success Metrics (KPIs)
KPI	Target
Duplicate recharge rate	<1%
Transaction status update delay	≤5 seconds
History page load time	<2 seconds
API success rate	>99%
Polling success rate	>98%
User satisfaction	>90%
7. Functional Requirements
FR-1 Recharge Creation

User initiates recharge.

System creates transaction with

Status = Pending

A unique Transaction ID is generated.

FR-2 Recharge History

Display

Mobile Number
Operator
Amount
Date & Time
Status
Transaction ID

Sorted by latest first.

FR-3 Live Status Polling

Instead of refreshing the page,

Frontend polls backend every

5 seconds

Backend returns latest status.

If status changes

Pending
↓

Success

or

Pending
↓

Failed

UI updates automatically.

FR-4 Duplicate Recharge Prevention

If same user attempts

Same Mobile Number

Same Operator

Same Amount

within

10 seconds

Backend rejects request.

Error:

Duplicate recharge detected.
Please wait 10 seconds.
FR-5 Filter by Date

User can filter by

Today
Last 7 Days
Last 30 Days
Custom Date Range
FR-6 Filter by Operator

Supported operators:

Airtel
Jio
Vi
BSNL
DTH Operators
Fastag Operators
FR-7 Loading State

While fetching

Show loading spinner

Loading recharge history...
FR-8 Empty State

If no transactions exist

Display

No recharge history found.
FR-9 Error State

If API fails

Display

Unable to fetch recharge history.
Retry.
8. User Stories
US-01

As a user,

I want to see my recharge history,

so that I can track previous transactions.

US-02

As a user,

I want recharge status to update automatically,

so that I don't need to refresh the page.

US-03

As a user,

I want to filter history by operator,

so that I can quickly find transactions.

US-04

As a user,

I want to filter by date,

so that I can view transactions from a specific period.

US-05

As a user,

I want duplicate recharges to be blocked,

so that I don't accidentally pay twice.

9. Acceptance Criteria
Recharge History
Latest transaction appears first
Status displayed correctly
Transaction ID visible
Polling
Poll every 5 seconds
No manual refresh needed
UI updates instantly after status change
Duplicate Prevention

Given

Recharge already submitted

When

User retries within 10 seconds

Then

API returns

409 Conflict

Message

Duplicate recharge detected.
Filters

User selects

Date + Operator

History updates correctly.

10. Non-Functional Requirements
Requirement	Target
API Response	<500 ms
Polling Interval	5 sec
Concurrent Users	10,000+
Uptime	99.9%
Mobile Responsive	Yes
Browser Support	Chrome, Edge, Firefox
11. Data Model
Recharge Transaction
Field	Type
id	UUID
userId	UUID
mobileNumber	String
operator	String
amount	Number
status	Pending/Success/Failed
transactionId	String
createdAt	Timestamp
updatedAt	Timestamp
12. API Requirements
POST /api/recharge

Create recharge

Response

{
  "transactionId": "TXN12345",
  "status": "Pending"
}
GET /api/recharge-history

Returns recharge list.

Supports

?page=1

&operator=Airtel

&from=2026-07-01

&to=2026-07-10
GET /api/status/:transactionId

Returns

{
    "status":"Success"
}

Used for polling.

13. Data Flow
User

↓

Clicks Recharge

↓

Backend Creates Transaction

↓

Status = Pending

↓

Saved in Database

↓

Recharge History Loads

↓

Frontend starts Polling (5 sec)

↓

Backend checks Payment Gateway

↓

Status Updated

↓

Frontend receives latest status

↓

UI updates automatically
14. Out of Scope (Version 1)
Push notifications
SMS alerts
Email receipts
WebSocket implementation
Recharge cancellation
Refund management
Download PDF invoice
15. Risks & Mitigation
Risk	Impact	Mitigation
Too many polling requests	High server load	Poll every 5 seconds and stop polling once a final status is reached
Duplicate recharge bypass	Financial loss	Validate user ID, mobile number, operator, amount, and 10-second window on the backend
Slow payment gateway response	Pending status persists	Display a "Processing" state and continue polling until timeout or completion
Database performance	Slow history loading	Add indexes on userId, createdAt, and operator; paginate history results
16. Assumptions
Users are authenticated before making a recharge.
Payment gateway provides transaction status updates.
Recharge history is stored in a relational database.
Backend maintains transaction timestamps accurately.
Polling stops automatically once the status becomes Success or Failed.
17. Future Enhancements (Version 2)
Real-time updates using WebSockets instead of polling.
Search by mobile number or transaction ID.
Export recharge history (CSV/PDF).
Favorite recharge operators.
Auto-recharge scheduling.
Refund tracking.
Push notifications for recharge completion.
18. Technical Architecture 
                 User
                   │
                   ▼
          Next.js Frontend
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
 Recharge API            History API
      │                         │
      └────────────┬────────────┘
                   ▼
            Backend Server
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
 Transaction Database    Payment Gateway
                   │
                   ▼
           Status Polling Service
                   │
                   ▼
          Updated Transaction Status
                   │
                   ▼
          Frontend UI Auto-Refresh