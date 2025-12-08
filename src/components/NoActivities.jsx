import search from "../assets/Search.png";

/**
 * Menampilkan tampilan ketika tidak ada aktivitas sama sekali.
 * Berisi ikon pencarian dan teks "Belum ada Aktivitas".
 */
export default function NoActivties() {
  return (
    <>
      <img className="size-50 mx-auto my-7" src={search} alt="No activities found"/>
      <p className="text-2xl text-gray-600 font-medium text-center">Belum ada Aktivitas</p>
    </>
  );
}