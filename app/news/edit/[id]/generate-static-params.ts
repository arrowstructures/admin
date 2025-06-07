import { supabaseServer } from "@/lib/supabase-server"

export async function generateStaticParams() {
  try {
    const { data, error } = await supabaseServer.from("news").select("id")

    if (error || !data) {
      console.error("Supabase error:", error)
      return []
    }

    return data.map((item) => ({ id: item.id.toString() }))
  } catch (err) {
    console.error("generateStaticParams failed:", err)
    return []
  }
}
