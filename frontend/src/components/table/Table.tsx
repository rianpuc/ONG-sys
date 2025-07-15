interface Column<T> {
    header: string;
    accessor?: keyof T;
    render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    selectedItem?: T | null;
    button?: boolean;
}

const Table = <T extends { [key: string]: any }>({ data, columns, onRowClick, selectedItem, button }: TableProps<T>) => {
    const keyAccessor = Object.keys(data[0] || {})[0] as keyof T;
    return (
        <div className="text-white max-h-115 p-4 overflow-x-hidden overflow-y-scroll">
            <div className="flex gap-2 mb-2 font-bold">
                {columns.map((column) => (
                    <div key={column.header} className="flex-1 p-3 text-center">
                        {column.header}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
                {data.map((item, index) => {
                    const isSelected = selectedItem && item[keyAccessor] === selectedItem[keyAccessor];
                    return (
                        <div
                            key={item[keyAccessor]}
                            onClick={() => onRowClick && onRowClick(item)}
                            className={`flex gap-2 py-4 rounded-lg items-center transition-all duration-200 ease-out hover:scale-101 
                        ${index % 2 === 0 ? 'bg-firstrow-100' : 'bg-secondrow-100'}
                        ${onRowClick ? 'cursor-pointer' : ''}
                        ${isSelected ? 'scale-101' : 'scale-100'}`}>
                            {columns.map((column) => (
                                <div key={`${item[keyAccessor]}-${column.header}`} className="flex-1 text-center">
                                    {column.render ? column.render(item) : item[column.accessor!]}
                                </div>
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Table;