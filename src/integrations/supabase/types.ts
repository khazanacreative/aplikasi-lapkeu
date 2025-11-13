export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          id: string
          nama_cabang: string
          alamat: string | null
          nomor_telepon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama_cabang: string
          alamat?: string | null
          nomor_telepon?: string | null
        }
        Update: {
          nama_cabang?: string
          alamat?: string | null
          nomor_telepon?: string | null
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          branch_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          branch_id?: string | null
        }
        Update: {
          role?: string
          branch_id?: string | null
        }
      }
      transaksi: {
        Row: {
          id: string
          branch_id: string | null
          user_id: string
          tanggal: string
          keterangan: string
          kategori: string
          jenis: string
          nominal: number
          invoice_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          branch_id?: string | null
          user_id: string
          tanggal: string
          keterangan: string
          kategori: string
          jenis: string
          nominal: number
          invoice_id?: string | null
        }
        Update: {
          branch_id?: string | null
          keterangan?: string
          kategori?: string
          jenis?: string
          nominal?: number
          invoice_id?: string | null
        }
      }
      invoice: {
        Row: {
          id: string
          branch_id: string | null
          user_id: string
          nomor_invoice: string
          pelanggan: string
          tanggal: string
          nominal: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          branch_id?: string | null
          user_id: string
          nomor_invoice: string
          pelanggan: string
          tanggal: string
          nominal: number
          status?: string
        }
        Update: {
          nomor_invoice?: string
          pelanggan?: string
          tanggal?: string
          nominal?: number
          status?: string
        }
      }
      pos_transaksi: {
        Row: {
          id: string
          branch_id: string | null
          kode_pos: string
          total: number
          tanggal: string
          sumber: string | null
          created_at: string
        }
        Insert: {
          id?: string
          branch_id?: string | null
          kode_pos: string
          total: number
          tanggal: string
          sumber?: string | null
        }
        Update: {
          kode_pos?: string
          total?: number
          tanggal?: string
          sumber?: string | null
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          nama_item: string
          jumlah: number
          harga_satuan: number
          subtotal: number
          keterangan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          nama_item: string
          jumlah: number
          harga_satuan: number
          subtotal: number
          keterangan?: string | null
        }
        Update: {
          nama_item?: string
          jumlah?: number
          harga_satuan?: number
          subtotal?: number
          keterangan?: string | null
        }
      }
      products: {
        Row: {
          id: string
          user_id: string
          branch_id: string | null
          nama: string
          harga: number
          stok: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          branch_id?: string | null
          nama: string
          harga: number
          stok?: number
        }
        Update: {
          nama?: string
          harga?: number
          stok?: number
        }
      }
      profiles: {
        Row: {
          id: string
          nama_usaha: string | null
          alamat: string | null
          whatsapp: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nama_usaha?: string | null
          alamat?: string | null
          whatsapp?: string | null
        }
        Update: {
          nama_usaha?: string | null
          alamat?: string | null
          whatsapp?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema[DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema[PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
