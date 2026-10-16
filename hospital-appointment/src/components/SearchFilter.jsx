export default function SearchFilter({
  search,
  setSearch,
  specialty,
  setSpecialty
}) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search doctor by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      >
        <option value="">All Specialties</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Dermatology">Dermatology</option>
        <option value="Neurology">Neurology</option>
      </select>
    </div>
  );
}