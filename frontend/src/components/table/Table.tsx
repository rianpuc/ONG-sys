interface Column<T> {
    header: string;
    accessor?: keyof T;
    render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
}

const Table = <T extends { [key: string]: any }>({ data, columns, onRowClick }: TableProps<T>) => {
    const keyAccessor = Object.keys(data[0] || {})[0] as keyof T;
    return (
        <div className="text-white">
            <div className="flex gap-2 mb-2 font-bold">
                {columns.map((column) => (
                    <div key={column.header} className="flex-1 p-3 bg-gray-700 rounded-md text-center">
                        {column.header}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
                {data.map((item, index) => (
                    <div
                        key={item[keyAccessor]}
                        onClick={() => onRowClick && onRowClick(item)}
                        className={`flex gap-2 p-4 rounded-md items-center transition duration-200 hover:scale-103 ${index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-500'}`}>
                        {columns.map((column) => (
                            <div key={`${item[keyAccessor]}-${column.header}`} className="flex-1 text-center">
                                {column.render ? column.render(item) : item[column.accessor!]}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Table;