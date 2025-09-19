import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// Sample data
const samplePlayers = [
  {
    name: 'Shadow',
    alias: 'Shadow Walker',
    notes: 'Stealth specialist with exceptional infiltration skills. Expert in close-quarters combat and silent takedowns.',
    created_at: new Date().toISOString()
  },
  {
    name: 'Nyx',
    alias: 'Night Hunter',
    notes: 'Expert tracker and reconnaissance specialist. Masters in surveillance and intelligence gathering.',
    created_at: new Date().toISOString()
  },
  {
    name: 'Phoenix',
    alias: 'Fire Starter',
    notes: 'Demolitions expert with tactical combat experience. Specializes in explosive ordinance and heavy weapons.',
    created_at: new Date().toISOString()
  },
  {
    name: 'Echo',
    alias: 'Silent Strike',
    notes: 'Sniper and long-range operations specialist. Expert marksman with over 100 confirmed long-range eliminations.',
    created_at: new Date().toISOString()
  },
  {
    name: 'Raven',
    alias: 'Dark Wing',
    notes: 'Intel gatherer and surveillance expert. Skilled in electronic warfare and cyber operations.',
    created_at: new Date().toISOString()
  }
];

const sampleAssets = [
  {
    type: 'Weapon',
    name: 'Silenced Pistol',
    quantity: 1,
    value: 2500,
    notes: 'Custom modified with extended magazine and suppressor'
  },
  {
    type: 'Equipment',
    name: 'Night Vision Goggles',
    quantity: 1,
    value: 5000,
    notes: 'Latest generation with thermal imaging capabilities'
  },
  {
    type: 'Vehicle',
    name: 'Motorcycle',
    quantity: 1,
    value: 15000,
    notes: 'Modified for stealth operations with noise reduction'
  },
  {
    type: 'Weapon',
    name: 'Assault Rifle',
    quantity: 1,
    value: 3500,
    notes: 'Tactical rifle with various attachments'
  },
  {
    type: 'Equipment',
    name: 'Body Armor',
    quantity: 2,
    value: 8000,
    notes: 'Kevlar reinforced with ceramic plates'
  }
];

const sampleTransactions = [
  {
    amount: 50000,
    type: 'credit',
    description: 'Mission completion bonus - Operation Silent Night'
  },
  {
    amount: 5000,
    type: 'debit',
    description: 'Equipment purchase - Night Vision Goggles'
  },
  {
    amount: 2500,
    type: 'debit',
    description: 'Weapon upgrade - Silenced Pistol modification'
  },
  {
    amount: 15000,
    type: 'credit',
    description: 'Contract fulfillment - Corporate espionage'
  },
  {
    amount: 8000,
    type: 'debit',
    description: 'Body armor purchase - Level IV protection'
  }
];

const sampleTasks = [
  {
    title: 'Update player profiles',
    description: 'Review and update all player information including skills and equipment',
    status: 'in-progress',
    priority: 'high',
    percent_complete: 75,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
  },
  {
    title: 'Asset audit',
    description: 'Conduct quarterly asset valuation and inventory check',
    status: 'todo',
    priority: 'medium',
    percent_complete: 0,
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
  },
  {
    title: 'Security protocol review',
    description: 'Review and update security protocols and access controls',
    status: 'todo',
    priority: 'high',
    percent_complete: 0,
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days from now
  },
  {
    title: 'Training schedule coordination',
    description: 'Coordinate and schedule training sessions for all players',
    status: 'in-progress',
    priority: 'medium',
    percent_complete: 30,
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days from now
  },
  {
    title: 'Equipment maintenance',
    description: 'Perform routine maintenance on all equipment and vehicles',
    status: 'done',
    priority: 'low',
    percent_complete: 100,
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    title: 'Intelligence briefing preparation',
    description: 'Prepare intelligence briefing for upcoming operations',
    status: 'in-progress',
    priority: 'high',
    percent_complete: 60,
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
  }
];

const sampleDocuments = [
  {
    filename: 'Mission Brief - Operation Silent Night',
    url: 'https://docs.google.com/document/d/example1',
    is_google_doc: true,
    storage_path: null
  },
  {
    filename: 'Player Evaluation - Shadow',
    url: 'https://docs.google.com/document/d/example2',
    is_google_doc: true,
    storage_path: null
  },
  {
    filename: 'Equipment Manifest',
    url: 'https://docs.google.com/document/d/example3',
    is_google_doc: true,
    storage_path: null
  },
  {
    filename: 'Security Protocol v2.1',
    url: 'https://docs.google.com/document/d/example4',
    is_google_doc: true,
    storage_path: null
  },
  {
    filename: 'Training Schedule Q4',
    url: 'https://docs.google.com/document/d/example5',
    is_google_doc: true,
    storage_path: null
  },
  {
    filename: 'Asset Valuation Report',
    url: 'https://docs.google.com/document/d/example6',
    is_google_doc: true,
    storage_path: null
  }
];

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Seed players
    console.log('Seeding players...');
    const { data: players, error: playersError } = await supabase
      .from('players')
      .insert(samplePlayers)
      .select();

    if (playersError) {
      console.error('Error seeding players:', playersError);
      return;
    }

    console.log(`Successfully seeded ${players.length} players`);

    // Seed assets for each player
    console.log('Seeding assets...');
    for (const player of players) {
      const playerAssets = sampleAssets.slice(0, 3).map(asset => ({
        ...asset,
        player_id: player.id,
        acquired_at: new Date().toISOString()
      }));

      const { error: assetsError } = await supabase
        .from('assets')
        .insert(playerAssets);

      if (assetsError) {
        console.error(`Error seeding assets for player ${player.name}:`, assetsError);
      }
    }

    // Seed transactions for each player
    console.log('Seeding transactions...');
    for (const player of players) {
      const playerTransactions = sampleTransactions.slice(0, 3).map(transaction => ({
        ...transaction,
        player_id: player.id,
        created_at: new Date().toISOString()
      }));

      const { error: transactionsError } = await supabase
        .from('finance_transactions')
        .insert(playerTransactions);

      if (transactionsError) {
        console.error(`Error seeding transactions for player ${player.name}:`, transactionsError);
      }
    }

    // Seed tasks
    console.log('Seeding tasks...');
    const { error: tasksError } = await supabase
      .from('tasks')
      .insert(sampleTasks.map(task => ({
        ...task,
        created_at: new Date().toISOString()
      })));

    if (tasksError) {
      console.error('Error seeding tasks:', tasksError);
    }

    // Seed documents
    console.log('Seeding documents...');
    const { error: documentsError } = await supabase
      .from('documents')
      .insert(sampleDocuments.map(doc => ({
        ...doc,
        owner_user_id: '1', // Default admin user
        created_at: new Date().toISOString()
      })));

    if (documentsError) {
      console.error('Error seeding documents:', documentsError);
    }

    console.log('Database seeding completed successfully!');
    console.log('\nSample data created:');
    console.log(`- ${players.length} players`);
    console.log(`- ${players.length * 3} assets`);
    console.log(`- ${players.length * 3} transactions`);
    console.log(`- ${sampleTasks.length} tasks`);
    console.log(`- ${sampleDocuments.length} documents`);

  } catch (error) {
    console.error('Unexpected error during seeding:', error);
  }
}

// Run the seeding
seedDatabase();