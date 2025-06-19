### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/newsletter-admin.git
   cd newsletter-admin
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install

   # or

   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. Set up the database:
   Run the SQL scripts in the `db/setup.sql` file in your Supabase SQL editor.

5. Set up storage:
   Follow the instructions in the [Storage Setup](#storage-setup) section.

6. Start the development server:
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application uses Supabase PostgreSQL for data storage. To set up the database:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `db/setup.sql` into the SQL Editor
4. Run the SQL script

This will create the necessary tables, indexes, and RLS policies for your application.

## Storage Setup

The application uses Supabase Storage for storing article thumbnails. To set up storage:

1. Go to your Supabase project dashboard
2. Navigate to the Storage section
3. Create a new bucket named "articles"
4. Set the bucket to public
5. Set up the following RLS policies:

### Policy 1: Allow authenticated users to upload files

- Policy name: "Allow authenticated uploads"
- Operation: INSERT
- For: authenticated users only
- Policy definition: `(bucket_id = 'articles')`

### Policy 2: Allow users to update their own files

- Policy name: "Allow users to update their own files"
- Operation: UPDATE
- For: authenticated users only
- Policy definition: `(bucket_id = 'articles' AND auth.uid() = owner)`

### Policy 3: Allow users to delete their own files

- Policy name: "Allow users to delete their own files"
- Operation: DELETE
- For: authenticated users only
- Policy definition: `(bucket_id = 'articles' AND auth.uid() = owner)`

### Policy 4: Allow public access to read files

- Policy name: "Allow public access to files"
- Operation: SELECT
- For: public access
- Policy definition: `(bucket_id = 'articles')`

Alternatively, you can run the SQL commands in `db/storage-setup.sql` in the SQL Editor.
