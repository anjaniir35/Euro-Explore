import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ywwnlbdfnhfryjloituo.supabase.co";

const supabaseKey = "sb_publishable_GwSMYh2Q47ogi6ZuXpcVvg_B2r7cSGV";

export const supabase = createClient(supabaseUrl, supabaseKey);