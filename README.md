1. Setup Guides
Clone the repository:  git clone https://github.com/Mamun707/Odds-Data-Table.git

2. Install Dependencies: npm install

3. Run the Development Server: npm run dev

4 . Extra Packages Used:

i. @tanstack/react-table: This is for flexible and performant table rendering.
ii. tailwind-merge: To intelligently merge Tailwind CSS classes. 
iii. clsx: For conditional className management. 

5. Approach

i. Table Library Choice: Choose @tanstack/react-table for its headless, fully customizable nature and strong performance, particularly with dynamic columns and large datasets.
ii. Dynamic Columns Generation: Columns are generated based on a configurable number (e.g., 200 bookkeepers) using useMemo to optimize re-renders.
iii. Real-Time Data Updates: Odds data refreshes every 5 seconds via an setInterval in useEffect. Data is transformed into a table-friendly format, and differences from the previous data are tracked using two Map references.
iv. Highlighting Changes: Odds cells blink and change color: Green when increased. Red when decreased. Gray when unchanged.via conditional classNames.

5. Challenges & Solutions:
   
i. Managing performance with large, dynamic tables: Used @tanstack/react-table's virtualized, headless model to control rendering efficiently.
ii. Tracking previous vs current odds without triggering excessive re-renders: Implemented useRef with Map to hold and compare previous data snapshots.
iii. Animating only changed values on update: Compared current vs previous odds per cell and applied a blink animation with a Tailwind utility class dynamically via clsx and tailwind-merge.
iv. Handling 200+ dynamic columns cleanly: Generated columns programmatically via useMemo, minimizing unnecessary recalculations.



