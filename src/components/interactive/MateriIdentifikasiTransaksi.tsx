'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { FileText, Calendar, Wallet } from 'lucide-react';

export default function MateriIdentifikasiTransaksi() {
    const [materiList, setMateriList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMateri = async () => {
        const { data } = await supabase
            .from('materi_akuntansi')
            .select('*')
            .order('created_at', { ascending: false });

        setMateriList(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchMateri();
    }, []);

    return (
        <div className="space-y-5">

            {loading && (
                <div className="text-center text-slate-500">
                    Memuat materi...
                </div>
            )}

            {!loading && materiList.length === 0 && (
                <div className="p-6 rounded-2xl border bg-white">
                    Belum ada materi dari guru.
                </div>
            )}

            {materiList.map((materi) => (
                <div
                    key={materi.id}
                    className="p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-cyan-500" />

                        <h3 className="font-bold text-lg">
                            {materi.judul}
                        </h3>
                    </div>

                    <div className="space-y-2 text-sm">

                        <div>
                            <b>Nomor Bukti :</b> {materi.nomor_bukti}
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            {materi.tanggal}
                        </div>

                        <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-emerald-500" />
                            Rp {Number(materi.nominal).toLocaleString('id-ID')}
                        </div>

                        <div>
                            <b>Keterangan :</b>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                            {materi.keterangan}
                        </div>

                        <div>
                            <b>Akun Debit :</b> {materi.akun_debit}
                        </div>

                        <div>
                            <b>Akun Kredit :</b> {materi.akun_kredit}
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}