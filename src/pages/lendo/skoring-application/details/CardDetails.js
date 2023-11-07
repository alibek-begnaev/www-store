import React, { useState, useEffect, useContext, useCallback } from 'react'
import Content from '../../../../layout/content/Content'
import Head from '../../../../layout/head/Head'
import { findUpper } from '../../../../utils/Utils'

import {
  userData,
  filterRole,
  filterStatus,
} from '../../../pre-built/user-manage/UserData'
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownItem,
} from 'reactstrap'
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  UserAvatar,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  Button,
  RSelect,
  TooltipComponent,
  Accordian,
} from '../../../../components/Component'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { LendoContext, Loader } from '../../LendoContext'
import ErrorModal from '../../../pre-built/user-manage/ErrorModal'
import AddModal from '../../../pre-built/user-manage/AddModal'
import { bulkActionOptions } from '../../../../utils/Utils'
import { dataInstance } from '../../../../utils/axios'
import { useCookies } from 'react-cookie'
import { useSessionStorage } from 'usehooks-ts'
import RequestAccordion from '../../lendo-request/accordion'

const CardDetails = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [actionText, setActionText] = useState('')
  const [itemPerPage, setItemPerPage] = useState(10)
  const [tablesm, updateTableSm] = useState(false)
  const [sm, updateSm] = useState(false)
  const [tableHeader, setTableHeader] = useState()

  useEffect(() => {
    if (data.length > 0) {
      setTableHeader(Object.keys(data[0]))
    }
  }, [])
  const onActionText = (e) => {
    setActionText(e.value)
  }
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const indexOfLastItem = currentPage * itemPerPage
  const indexOfFirstItem = indexOfLastItem - itemPerPage
  const currentItems = data && data.slice(indexOfFirstItem, indexOfLastItem)
  return (
    <React.Fragment>
      <Block>
        <DataTable className="card-stretch">
          <DataTableBody compact>
            <DataTableHead>
              {/* <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      onChange={(e) => selectorCheck(e)}
                      id="uid"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="uid"
                    ></label>
                  </div>
                </DataTableRow> */}
              <DataTableRow>
                <span>Num</span>
              </DataTableRow>
              <DataTableRow>
                <span>Amount</span>
              </DataTableRow>
              <DataTableRow>
                <span>Type</span>
              </DataTableRow>
              <DataTableRow>
                <span>Count</span>
              </DataTableRow>
              <DataTableRow>
                <span>Period</span>
              </DataTableRow>

              {/* {tableHeader &&
                  tableHeader
                    .filter((el) => el !== 'overData')
                    .map((item, index) => (
                      <DataTableRow key={index}>
                        <span className="sub-text">
                          {item
                            .split('_')
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(' ')}
                        </span>
                      </DataTableRow>
                    ))} */}
            </DataTableHead>
            {/*Head*/}
            {currentItems
              ? currentItems.map((item, index) => {
                  return (
                    <div key={index} style={{ display: 'table-row-group' }}>
                      <DataTableItem key={index}>
                        <DataTableRow>
                          <span>{index + 1}</span>
                        </DataTableRow>
                        {tableHeader &&
                          tableHeader
                            .filter((el) => el !== 'overData')
                            .map((el, index) => (
                              <DataTableRow key={el}>
                                <span>{item[el]}</span>
                              </DataTableRow>
                            ))}

                        {/* <DataTableRow>
                            <span>{item.branch}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span>{item.contract_date}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span>{item.contract_status}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span>{item.org_name}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span>{item.org_type}</span>
                          </DataTableRow> */}
                      </DataTableItem>
                      {/* <DataTableItem>
                          <td></td>
                          <RequestAccordion
                            title="JSON View"
                            req={item.request}
                            res={item.response}
                          />
                        </DataTableItem> */}
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
      </Block>

      {/* <ErrorModal
          modal={modal.error}
          closeModal={closeEditModal}
          message={errorMessage}
        /> */}
    </React.Fragment>
  )
}
export default CardDetails
