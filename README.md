# Restaurant Reservation App

## Overview

This project is a restaurant table reservation app created for CGI's 2026 Summer Internship position. 
Completing the project took me about a week of coding several hours every day. I got the essentials done and some "extras" that were mentioned in the task instructions. The hardest part for me was creating the drag and drop system for the admin view. I used the help of AI to finish it. I used AI to help me mostly with the mathematical calculations of table placement positions and clamping logic. All use cases of AI generated code have been commented in the project. 

## How to start the project?

Run `docker compose up --build` in the project root and go to `localhost:5173` on your browser and you are good to go.

# Project Description

## Core Business Logic

### Reservation Logic

- A table is unavailable if it has an overlapping reservation during the selected time period.
- Reserved table IDs are fetched from the backend and used by the frontend to mark unavailable tables in red.
- The recommendation system selects the best available table based on:
  - whether the table is already reserved
  - whether the table fits the guest count
  - whether it matches the selected zone
  - whether it matches the selected preference
  - how closely the table capacity matches the group size

### Recommendation Scoring

- Tables with less empty seats are preferred
- Preference matches add bonus score
- Tables already reserved for the selected time range are excluded.
- Tables outside the selected zone are excluded.

Supported preferences:

- `WINDOW`
- `PRIVATE`
- `NEAR_PLAY_AREA`

### Reservation Duration

The reservation filter UI enforces a minimum duration of 1 hour on the frontend.

- The default reservation duration is 2 hours.
- If the user selects an end time earlier than 1 hour after the start time, the UI automatically adjusts it.

## Floorplan Logic

The restaurant layout is modeled as a fixed `10 x 10` logical grid.

### Main Zones

There are 3 main seating zones:

- `TERRACE`
- `INDOOR`
- `PRIVATE_ROOM`

Tables must:

- fit fully inside a single zone
- not overlap with any other table

## Preference Areas

### Indoor Window Areas

The indoor zone contains two `Near window` areas. Each window area spans 2 grid columns within the indoor zone.

### Terrace Play Area

The terrace contains a `Near play area` region. The actual play area is therefore outside the restaurant floor plan.

### Private Preference

The `PRIVATE` preference means the user prefers a table in the `PRIVATE_ROOM` zone.

## Special Features

### Admin Page

Admins can drag tables on the floorplan to update the restaurant layout.

On drop:

1. The frontend computes the new grid coordinates.
2. The frontend validates basic placement
3. The frontend sends the update to the backend.
4. The backend validates:
   - zone fit
   - overlap prevention
5. The backend saves the new position and updates the table’s preference attribute

### Data Initialization

On first startup, the backend automatically creates:

- a set of tables
- a layout across all zones
- example reservations

The initializer tries to distribute tables instead of packing everything into the first available cells.

## Responsibilities of frontend/backend

### Frontend

The frontend is responsible for:

- page navigation
- reservation filters
- floorplan rendering
- reservation interaction
- admin drag and drop editing
- confirmation display

### Backend

Main backend responsibilities:

- table recommendation
- overlap detection
- saving reservations to DB.
- data initialization on first startup.
- Controllers expose REST endpoints.
- Services hold the business logic.
- Repositories handle database access
- Entities represent tables, reservations, zones and preferences.

## Possible improvements & unimplemented features

- Dynamic merging of tables
- External API (e.g. TheMealDB) integration
- testing
- reservation cancellation & modification