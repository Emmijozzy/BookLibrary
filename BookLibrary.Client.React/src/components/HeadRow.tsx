const HeadRow = () => {
  return (
    <tr>
      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        #
      </th>
      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Cover
      </th>
      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Title
      </th>
      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Author
      </th>
      <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        ISBN
      </th>
      <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Published
      </th>
      <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Pages
      </th>
      <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Genre
      </th>
      <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Publisher
      </th>
      <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Language
      </th>
      <th className="hidden xl:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Privacy
      </th>
      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  )
}

export default HeadRow
