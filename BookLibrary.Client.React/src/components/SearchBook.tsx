type Props = {
  searchField:  string;
  setSearchField: (value: React.SetStateAction<string>) => void;
  searchTerm: string;
  setSearchTerm: (value: React.SetStateAction<string>) => void;
}

const SearchBook = ({searchField, searchTerm, setSearchField, setSearchTerm}: Props) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4">
      <select 
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="w-full sm:w-auto rounded border border-slate-300 px-3 py-2"
      >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="isbn">ISBN</option>
          <option value="genre">Genre</option>
          <option value="publisher">Publisher</option>
          <option value="language">Language</option>
      </select>
      <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
      />
    </div>
  )
}

export default SearchBook