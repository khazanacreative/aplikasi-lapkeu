// Manual database types since auto-generated types are not synced

export type AppRole = 'admin_pusat' | 'admin_cabang' | 'staff';

export interface Branch {
  id: string;
  nama_cabang: string;
  alamat: string | null;
  nomor_telepon: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  branch_id: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  nama_usaha: string | null;
  alamat: string | null;
  whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaksi {
  id: string;
  branch_id: string | null;
  user_id: string;
  tanggal: string;
  keterangan: string;
  kategori: string;
  jenis: 'Debet' | 'Kredit';
  nominal: number;
  invoice_id: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  branch_id: string | null;
  user_id: string;
  nomor_invoice: string;
  pelanggan: string;
  tanggal: string;
  nominal: number;
  status: 'Lunas' | 'Belum Lunas' | 'Belum Dibayar';
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  nama_item: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  keterangan: string | null;
  created_at: string;
  updated_at: string;
}

export interface PosTransaksi {
  id: string;
  branch_id: string;
  kode_pos: string;
  total: number;
  tanggal: string;
  sumber: string | null;
  created_at: string;
}
