import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center"
                >
                  {/* Контейнер для центрирования содержимого заголовка, если там будут иконки */}
                  <div className="flex items-center justify-center">
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-center">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;