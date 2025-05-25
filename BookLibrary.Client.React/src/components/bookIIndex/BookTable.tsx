import { Book } from "../../Types/book";
import BodyRow from "../BodyRow";
import HeadRow from "../HeadRow";

interface BookTableProps {
  books: Book[]
}

const BookTable = ({ books }: BookTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <HeadRow />
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {books.map((item, index) => (
                <BodyRow item={item} key={item.id} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BookTable