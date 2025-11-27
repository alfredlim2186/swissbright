/**
 * Malaysia States and Cities Data
 * Contains all Malaysian states and their corresponding cities
 */

export interface StateCity {
  state: string
  cities: string[]
}

export const MALAYSIA_STATES_AND_CITIES: StateCity[] = [
  {
    state: 'Johor',
    cities: [
      'Johor Bahru',
      'Batu Pahat',
      'Muar',
      'Segamat',
      'Kluang',
      'Kota Tinggi',
      'Pontian',
      'Mersing',
      'Tangkak',
      'Kulai',
      'Pasir Gudang',
      'Ulu Tiram',
      'Skudai',
      'Senai',
      'Gelang Patah',
      'Pekan Nanas',
    ],
  },
  {
    state: 'Kedah',
    cities: [
      'Alor Setar',
      'Sungai Petani',
      'Kulim',
      'Langkawi',
      'Jitra',
      'Kuala Kedah',
      'Yan',
      'Pokok Sena',
      'Kubang Pasu',
      'Padang Terap',
      'Baling',
      'Pendang',
      'Sik',
      'Bandar Baharu',
    ],
  },
  {
    state: 'Kelantan',
    cities: [
      'Kota Bharu',
      'Pasir Mas',
      'Tumpat',
      'Pasir Puteh',
      'Bachok',
      'Machang',
      'Jeli',
      'Gua Musang',
      'Tanah Merah',
      'Ketereh',
      'Wakaf Bharu',
      'Kadok',
      'Rantau Panjang',
    ],
  },
  {
    state: 'Kuala Lumpur',
    cities: [
      'Kuala Lumpur',
      'Bukit Bintang',
      'Cheras',
      'Setapak',
      'Wangsa Maju',
      'Bandar Tun Razak',
      'Segambut',
      'Lembah Pantai',
      'Seputeh',
    ],
  },
  {
    state: 'Labuan',
    cities: [
      'Victoria',
      'Bukit Kuda',
      'Layang-Layangan',
      'Sungai Lada',
      'Pantai',
      'Sungai Bedaun',
      'Patau-Patau',
    ],
  },
  {
    state: 'Malacca',
    cities: [
      'Malacca City',
      'Alor Gajah',
      'Jasin',
      'Ayer Keroh',
      'Bukit Beruang',
      'Batu Berendam',
      'Masjid Tanah',
      'Sungai Udang',
      'Asahan',
      'Merlimau',
    ],
  },
  {
    state: 'Negeri Sembilan',
    cities: [
      'Seremban',
      'Nilai',
      'Port Dickson',
      'Bahau',
      'Tampin',
      'Kuala Pilah',
      'Rembau',
      'Jelebu',
      'Jempol',
      'Kuala Klawang',
    ],
  },
  {
    state: 'Pahang',
    cities: [
      'Kuantan',
      'Temerloh',
      'Bentong',
      'Mentakab',
      'Raub',
      'Jerantut',
      'Kuala Lipis',
      'Cameron Highlands',
      'Pekan',
      'Gambang',
      'Maran',
      'Kemaman',
    ],
  },
  {
    state: 'Penang',
    cities: [
      'George Town',
      'Butterworth',
      'Bayan Lepas',
      'Bayan Baru',
      'Bukit Mertajam',
      'Nibong Tebal',
      'Seberang Perai',
      'Tanjung Tokong',
      'Gelugor',
      'Air Itam',
      'Balik Pulau',
    ],
  },
  {
    state: 'Perak',
    cities: [
      'Ipoh',
      'Taiping',
      'Teluk Intan',
      'Sitiawan',
      'Kampar',
      'Batu Gajah',
      'Kuala Kangsar',
      'Simpang Pulai',
      'Lumut',
      'Parit Buntar',
      'Bidor',
      'Tapah',
    ],
  },
  {
    state: 'Perlis',
    cities: [
      'Kangar',
      'Arau',
      'Padang Besar',
      'Kuala Perlis',
      'Simpang Empat',
      'Beseri',
    ],
  },
  {
    state: 'Putrajaya',
    cities: [
      'Putrajaya',
      'Presint 1',
      'Presint 2',
      'Presint 3',
      'Presint 4',
      'Presint 5',
      'Presint 6',
      'Presint 7',
      'Presint 8',
      'Presint 9',
      'Presint 10',
      'Presint 11',
      'Presint 14',
      'Presint 15',
      'Presint 16',
      'Presint 17',
      'Presint 18',
    ],
  },
  {
    state: 'Sabah',
    cities: [
      'Kota Kinabalu',
      'Sandakan',
      'Tawau',
      'Lahad Datu',
      'Keningau',
      'Papar',
      'Kudat',
      'Semporna',
      'Beaufort',
      'Ranau',
      'Penampang',
      'Putatan',
    ],
  },
  {
    state: 'Sarawak',
    cities: [
      'Kuching',
      'Miri',
      'Sibu',
      'Bintulu',
      'Limbang',
      'Sri Aman',
      'Sarikei',
      'Kapit',
      'Mukah',
      'Betong',
      'Kota Samarahan',
      'Samarahan',
    ],
  },
  {
    state: 'Selangor',
    cities: [
      'Shah Alam',
      'Petaling Jaya',
      'Klang',
      'Subang Jaya',
      'Ampang',
      'Puchong',
      'Kajang',
      'Selayang',
      'Rawang',
      'Bangi',
      'Sepang',
      'Kuala Selangor',
      'Sabak Bernam',
      'Hulu Selangor',
      'Gombak',
      'Hulu Langat',
      'Klang Valley',
    ],
  },
  {
    state: 'Terengganu',
    cities: [
      'Kuala Terengganu',
      'Kemaman',
      'Dungun',
      'Marang',
      'Hulu Terengganu',
      'Setiu',
      'Besut',
      'Kuala Nerus',
      'Chukai',
      'Permaisuri',
      'Bukit Besi',
    ],
  },
]

/**
 * Get all Malaysia states
 */
export function getMalaysiaStates(): string[] {
  return MALAYSIA_STATES_AND_CITIES.map((item) => item.state)
}

/**
 * Get cities for a specific state
 */
export function getCitiesByState(state: string): string[] {
  const stateData = MALAYSIA_STATES_AND_CITIES.find(
    (item) => item.state.toLowerCase() === state.toLowerCase()
  )
  return stateData?.cities || []
}

/**
 * Get all cities in Malaysia
 */
export function getAllMalaysiaCities(): string[] {
  return MALAYSIA_STATES_AND_CITIES.flatMap((item) => item.cities)
}



