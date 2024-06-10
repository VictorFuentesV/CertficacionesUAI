// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvcusyfentyezvuopvzd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2Y3VzeWZlbnR5ZXp2dW9wdnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3MTg2MjcsImV4cCI6MjAzMTI5NDYyN30.MWV4OvwvQcYBgD4DhbpvfWw32cxVivHPkWGrveCKyNM'
export const supabase = createClient(supabaseUrl, supabaseKey)

async function getUserRole(userId) {
    const { data, error } = await supabase
        .from('userinfo')
        .select('role')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
    return data.role;
}
