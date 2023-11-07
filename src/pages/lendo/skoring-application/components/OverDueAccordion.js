import React, { useState, useEffect } from 'react'
import { Collapse } from 'reactstrap'
import { CodeBlock } from '../../../../components/Component'
import {
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
} from '../../../../components/Component'

const OverDueAccordion = ({ data, className, variation, ...props }) => {
  const [isOpen, setIsOpen] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemPerPage, setItemPerPage] = useState(10)
  const [tableHeader, setTableHeader] = useState()

  useEffect(() => {
    if (data.length > 0) {
      setTableHeader(Object.keys(data[0]))
    }
  }, [])

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const indexOfLastItem = currentPage * itemPerPage
  const indexOfFirstItem = indexOfLastItem - itemPerPage
  const currentItems = data && data.slice(indexOfFirstItem, indexOfLastItem)
  const toggleCollapse = (param) => {
    if (param === isOpen) {
      setIsOpen('0')
    } else {
      setIsOpen(param)
    }
  }
  return (
    <td
      colSpan={6}
      className={[
        `accordion${variation ? ' accordion-s' + variation : ''}${
          className ? ' ' + className : ''
        }`,
      ]}
    >
      <div className="accordion-item">
        <div
          className={[`accordion-head${isOpen !== '1' ? ' collapsed' : ''}`]}
          onClick={() => toggleCollapse('1')}
        >
          <h6 className="title">Katm OverDues</h6>
          <span className="accordion-icon"></span>
        </div>

        <Collapse
          className="accordion-body"
          isOpen={isOpen === '1' ? true : false}
        >
          <div className="accordion-inner">
            <DataTable className="card-stretch">
              <DataTableBody compact>
                <DataTableHead>
                  <DataTableRow>
                    <span>Num</span>
                  </DataTableRow>
                  {tableHeader &&
                    tableHeader.map((el, index) => (
                      <DataTableRow key={el}>
                        <span>
                          {el
                            .split('_')
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(' ')}
                        </span>
                      </DataTableRow>
                    ))}
                </DataTableHead>

                {currentItems
                  ? currentItems.map((item, index) => {
                      return (
                        <div key={index} style={{ display: 'table-row-group' }}>
                          <DataTableItem key={index}>
                            <DataTableRow>
                              <span>{index + 1}</span>
                            </DataTableRow>
                            {tableHeader &&
                              tableHeader.map((el, index) => (
                                <DataTableRow key={el}>
                                  <span>{item[el]}</span>
                                </DataTableRow>
                              ))}
                          </DataTableItem>
                        </div>
                      )
                    })
                  : null}
              </DataTableBody>

              <div className="card-inner">
                {data && data.length > 0 ? (
                  <PaginationComponent
                    itemPerPage={itemPerPage}
                    totalItems={data.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-silent">No data found</span>
                  </div>
                )}
              </div>
            </DataTable>
          </div>
        </Collapse>
      </div>
    </td>
  )
}

export default OverDueAccordion
