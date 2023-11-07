import React, { useState, useEffect, useContext, useCallback } from 'react'
import { CSVLink, CSVDownload } from 'react-csv'

import Content from '../../../layout/content/Content'
import Head from '../../../layout/head/Head'
import { findUpper } from '../../../utils/Utils'

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
} from '../../../components/Component'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { LendoContext, Loader } from '../LendoContext'
import ErrorModal from '../../pre-built/user-manage/ErrorModal'
import { bulkActionOptions } from '../../../utils/Utils'
import { filterDatas, sortDatas } from './components/default'
import { dataInstance2 } from '../../../utils/axios'
import { useCookies } from 'react-cookie'
import { useSessionStorage } from 'usehooks-ts'
import FilterApplication from './components/filter'
import SortApplication from './components/sort'

const LendoSkoringApplication2 = () => {
  const { contextData } = useContext(LendoContext)
  const [data, setData] = contextData
  const [cookie, setCookie, removeCookie] = useCookies()
  const [loader, setLoader] = useContext(Loader)
  const navigate = useNavigate()
  const [sort, setSort] = useSessionStorage('lendoSkoringApplicationSort', [
    ...sortDatas,
  ])
  const [filter, setFilter] = useSessionStorage(
    'lendoSkoringApplicationFilter',
    { ...filterDatas }
  )
  let { pinfl } = useParams()
  const [sm, updateSm] = useState(false)
  const [tablesm, updateTableSm] = useState(false)
  const [onSearch, setonSearch] = useState(true)
  const [onSearchText, setSearchText] = useState('')
  const [dataPage, setDataPage] = useState()
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  })
  const [editId, setEditedId] = useState()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    balance: 0,
    phone: '',
    status: 'Active',
  })
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    balance: 0,
    phone: '',
    status: '',
  })

  const [actionText, setActionText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [errorMessage, setErrorMessage] = useState()

  const [tableHeader, setTableHeader] = useSessionStorage(
    'lendoSkoringApplication2Header',
    [
      { title: 'Name', visible: true, key: 'name' },
      { title: 'Passport', visible: true, key: 'document_serial' },
      { title: 'Pinfl', visible: true, key: 'pinfl' },
      { title: 'Phone', visible: true, key: 'phone' },
      { title: 'Card number', visible: true, key: 'card_number' },
      { title: 'Card Type', visible: true, key: 'card_type' },
      { title: 'Birthday', visible: true, key: 'birth_date' },
      { title: 'Status', visible: true, key: 'status' },

      {
        title: 'Amal qilish muddati',
        visible: false,
        key: 'document_expire_date',
      },
      { title: 'Berilgan Sana', visible: false, key: 'document_issue_date' },
      {
        title: 'Passport issued place',
        visible: false,
        key: 'document_issue_place',
      },
      { title: 'Document Region', visible: false, key: 'document_region' },

      { title: 'Address', visible: false, key: 'residence_address' },
    ]
  )

  const fetchData = () => {
    setLoader(true)
    setData([])
    dataInstance2
      .post(`/applications`, {
        pageNumber: currentPage - 1,
        pageSize: filter?.itemPerPage ? filter.itemPerPage : 25,
      })
      .then((res) => {
        setData(
          res?.data?.done.content.map((item) => ({
            ...item,
            checked: false,
          }))
        )
        setDataPage({
          totalItems: res?.data?.done.totalElements,
          totalPages: res?.data?.done.totalPages,
          size: res?.data?.done.size,
        })
        setLoader(false)
      })
      .catch((error) => {
        console.log(error)
        setLoader(false)
      })
  }
  // unselects the data on mount
  const fetchDataByFilter = useCallback(
    (props) => {
      const { filters, sorts } = props

      const filteredKeys = Object.keys(filters).filter(
        (el) => !!filters[el] === true && el != 'itemPerPage'
      )

      const filterdValues = filteredKeys.map((el) => {
        if (typeof filters[el] === 'object') {
          return filters[el].label
        } else {
          return filters[el]
        }
      })
      const filterOperators = filteredKeys.map((el) =>
        el === 'id' ? 'equal' : 'like'
      )
      const sortKeys = sorts
        .filter((e) => e.orderNum !== '')
        .sort((a, b) => a.orderNum - b.orderNum)
        .map((item) => item.className)
      const sortValues = sortKeys.map(
        (item) => sorts[sorts.findIndex((e) => e.className === item)].order
      )
      console.log(sortKeys, sortValues)
      setData([])
      setLoader(true)
      dataInstance2
        .post(`/applications`, {
          sortFields: [...sortKeys],
          sortDirections: [...sortValues],
          filterFields: [...filteredKeys],
          filterValues: [...filterdValues],
          filterOperators: [...filterOperators],
          pageNumber: currentPage - 1,
          pageSize: filters?.itemPerPage ? filters.itemPerPage : 25,
        })
        .then((res) => {
          setData(
            res?.data?.done.content.map((item) => ({
              ...item,
              checked: false,
            }))
          )
          setDataPage({
            totalItems: res?.data?.done.totalElements,
            totalPages: res?.data?.done.totalPages,
            size: res?.data?.done.size,
          })
          setLoader(false)
        })
        .catch((error) => {
          console.log(error)
          setLoader(false)
        })
    },
    [currentPage, setData, setLoader]
  )

  let isFilterEmpty = true
  for (const key in filter) {
    if (
      Object.prototype.hasOwnProperty.call(filter, key) &&
      key !== 'itemPerPage'
    ) {
      if (filter[key] !== '' || typeof filter[key] !== 'string') {
        isFilterEmpty = false
        break
      }
    }
  }
  const isSortEmpty = sort.some((obj) => obj.orderNum !== '')
  console.log(isSortEmpty)
  useEffect(() => {
    if (!isFilterEmpty || isSortEmpty) {
      fetchDataByFilter({ filters: filter, sorts: sort })
    } else {
      fetchData()
    }
  }, [fetchDataByFilter])

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value)
  }
  // function to change the selected property of an item
  const onSelectChange = (e, id) => {
    let newData = data
    let index = newData.findIndex((item) => item.id === id)
    newData[index].checked = e.currentTarget.checked
    setData([...newData])
  }
  // function to change the Raws selected
  const onRawSelectChange = (e, title) => {
    let newData = tableHeader
    let index = newData.findIndex((item) => item.title === title)
    newData[index].visible = e.currentTarget.checked
    setTableHeader([...newData])
    // setCookie('filter', [...newData], { path: '/lendo' })
  }
  // function to set the action to be taken in table header

  // function to reset the form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      balance: 0,
      phone: '',
      status: 'Active',
    })
  }

  const closeEditModal = () => {
    setModal({ edit: false })
    resetForm()
  }

  // submit function to add a new item
  const onFormSubmit = (submitData) => {
    const { name, email, balance, phone } = submitData
    let submittedData = {
      id: data.length + 1,
      avatarBg: 'purple',
      name: name,
      role: 'Customer',
      email: email,
      balance: balance,
      phone: phone,
      emailStatus: 'success',
      kycStatus: 'alert',
      lastLogin: '10 Feb 2020',
      status: formData.status,
      country: 'Bangladesh',
    }
    setData([submittedData, ...data])
    resetForm()
    setModal({ edit: false }, { add: false })
  }

  // submit function to update a new item
  const onEditSubmit = (submitData) => {
    const { name, email, phone } = submitData
    let submittedData
    let newitems = data
    newitems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          id: item.id,
          avatarBg: item.avatarBg,
          name: name,
          image: item.image,
          role: item.role,
          email: email,
          balance: editFormData.balance,
          phone: phone,
          emailStatus: item.emailStatus,
          kycStatus: item.kycStatus,
          lastLogin: item.lastLogin,
          status: editFormData.status,
          country: item.country,
        }
      }
    })
    let index = newitems.findIndex((item) => item.id === editId)
    newitems[index] = submittedData
    setModal({ edit: false })
  }

  const onErrorClick = (message) => {
    setModal({ error: true }, { add: false }, { edit: false })
    setErrorMessage(message)
  }
  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setEditFormData({
          name: item.name,
          email: item.email,
          status: item.status,
          phone: item.phone,
          balance: item.balance,
        })
        setModal({ edit: true }, { add: false })
        setEditedId(id)
      }
    })
  }

  // function to change to suspend property for an item
  const suspendUser = (id) => {
    let newData = data
    let index = newData.findIndex((item) => item.id === id)
    newData[index].status = 'Suspend'
    setData([...newData])
  }

  // function which fires on applying selected action
  const onActionClick = (e) => {
    if (actionText === 'suspend') {
      let newData = data.map((item) => {
        if (item.checked === true) item.status = 'Suspend'
        return item
      })
      setData([...newData])
    } else if (actionText === 'delete') {
      let newData
      newData = data.filter((item) => item.checked !== true)
      setData([...newData])
    }
  }

  // function which selects all the items
  const selectorCheck = (e) => {
    let newData
    newData = data.map((item) => {
      item.checked = e.currentTarget.checked
      return item
    })
    setData([...newData])
  }

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch)

  //   // Get current list, pagination
  //   const indexOfLastItem = currentPage * itemPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemPerPage;
  //   const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  // const indexOfLastItem = currentPage * itemPerPage
  // const indexOfFirstItem = indexOfLastItem - itemPerPage
  // const currentItems = data && data.slice(indexOfFirstItem, indexOfLastItem)
  // console.log(currentItems)
  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleItemsPerPage = () => {
    fetchDataByFilter({ filters: filter, sorts: sort })
  }

  return (
    <React.Fragment>
      <Head title="User List - Compact"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Users Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {dataPage?.totalItems} users.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${
                    sm ? 'active' : ''
                  }`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div
                  className="toggle-expand-content"
                  style={{ display: sm ? 'block' : 'none' }}
                >
                  <ul className="nk-block-tools g-3">
                    <li>
                      {data && (
                        <CSVLink
                          filename={'application-list.csv'}
                          className="btn btn-white btn-outline-light"
                          data={data}
                        >
                          <Icon name="download-cloud"></Icon>
                          <span>Export</span>
                        </CSVLink>
                      )}
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button
                        color="primary"
                        className="btn-icon"
                        onClick={() => setModal({ add: true })}
                      >
                        <Icon name="plus"></Icon>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    {/* <div className="form-wrap">
                      <RSelect
                        options={bulkActionOptions}
                        className="w-130px"
                        placeholder="Bulk Action"
                        onChange={(e) => onActionText(e)}
                      />
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          disabled={actionText !== '' ? false : true}
                          color="light"
                          outline
                          className="btn-dim"
                          onClick={(e) => onActionClick(e)}
                        >
                          Apply
                        </Button>
                      </span>
                      <span className="d-md-none">
                        <Button
                          color="light"
                          outline
                          disabled={actionText !== '' ? false : true}
                          className="btn-dim  btn-icon"
                          onClick={(e) => onActionClick(e)}
                        >
                          <Icon name="arrow-right"></Icon>
                        </Button>
                      </span>
                    </div> */}
                  </div>
                </div>
                <div className="card-tools me-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <Button
                        color="light"
                        outline
                        className="btn-dim"
                        onClick={handleItemsPerPage}
                      >
                        Apply
                      </Button>
                    </li>
                    <li>
                      <input
                        value={filter?.itemPerPage}
                        onChange={(e) => {
                          e.preventDefault()
                          setFilter((prev) => ({
                            ...prev,
                            itemPerPage: e.target.value,
                          }))
                        }}
                        style={{ textAlign: 'center', width: '80px' }}
                        name="itemPerPage"
                        className="form-control form-control-sm"
                      />
                    </li>
                    <li>
                      {data?.length > 0 && (
                        <PaginationComponent
                          itemPerPage={dataPage?.size}
                          totalItems={dataPage?.totalItems}
                          paginate={paginate}
                          currentPage={currentPage}
                        />
                      )}
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${
                            tablesm ? 'active' : ''
                          }`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div
                          className={`toggle-content ${
                            tablesm ? 'content-active' : ''
                          }`}
                        >
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button
                                className="btn-icon btn-trigger toggle"
                                onClick={() => updateTableSm(false)}
                              >
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>
                            <li>
                              <FilterApplication
                                filterSubmit={fetchDataByFilter}
                                resetSubmit={fetchData}
                              />
                            </li>
                            <li>
                              <SortApplication
                                filterSubmit={fetchDataByFilter}
                                resetSubmit={fetchData}
                                datas={data}
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className={`card-search search-wrap ${!onSearch && 'active'}`}
              >
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText('')
                        toggle()
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {data && (
              <DataTableBody compact>
                <DataTableHead>
                  <DataTableRow className="nk-tb-col-check">
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
                  </DataTableRow>
                  {tableHeader
                    .filter((a) => a.visible === true)
                    .map((item, index) => (
                      <DataTableRow key={index}>
                        <span className="sub-text">{item.title}</span>
                      </DataTableRow>
                    ))}
                  {/* <DataTableRow>
                                    <span className="sub-text">User</span>
                                </DataTableRow>
                                <DataTableRow size="sm">
                                    <span className="sub-text">Email</span>
                                </DataTableRow>
                                <DataTableRow size="md">
                                    <span className="sub-text">Phone</span>
                                </DataTableRow>
                                <DataTableRow size="md">
                                    <span className="sub-text">
                                        birth_country
                                    </span>
                                </DataTableRow>
                                <DataTableRow>
                                    <span className="sub-text">Status</span>
                                </DataTableRow>
                                <DataTableRow size="lg">
                                    <span className="sub-text">birth_date</span>
                                </DataTableRow>
                                <DataTableRow size="lg">
                                    <span className="sub-text">
                                        birth_place
                                    </span>
                                </DataTableRow>
                                <DataTableRow size="lg">
                                    <span className="sub-text">bxmCode</span>
                                </DataTableRow> */}

                  <DataTableRow className="nk-tb-col-tools text-end">
                    <div
                    // style={{
                    //     overflow: 'hidden',
                    // }}
                    >
                      <UncontrolledButtonDropdown
                      // toggle={() =>
                      //     setDropdownOpen(!dropdownOpen)
                      // }
                      // isOpen={dropdownOpen}
                      >
                        <DropdownToggle
                          tag="a"
                          className="btn btn-xs btn-outline-light btn-icon dropdown-toggle"
                        >
                          <Icon name="plus"></Icon>
                        </DropdownToggle>

                        <DropdownMenu className="dropdown-menu-xs">
                          <ul className="link-tidy sm no-bdr">
                            {tableHeader
                              .filter((e, i) => i > 7)
                              .map((item, index) => (
                                <li key={index}>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      defaultChecked={item.visible}
                                      onChange={(e) =>
                                        onRawSelectChange(e, item.title)
                                      }
                                      id={item.title}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor={item.title}
                                    >
                                      {item.title}
                                    </label>
                                  </div>
                                </li>
                              ))}
                            {/* <li>
                                                    <div className="custom-control custom-control-sm custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="bl"
                                                        />
                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="bl"
                                                        >
                                                            Balance
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="custom-control custom-control-sm custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="ph"
                                                        />
                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="ph"
                                                        >
                                                            Phone
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="custom-control custom-control-sm custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="vri"
                                                        />
                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="vri"
                                                        >
                                                            Verified
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="custom-control custom-control-sm custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="st"
                                                        />
                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="st"
                                                        >
                                                            Status
                                                        </label>
                                                    </div>
                                                </li> */}
                          </ul>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                  </DataTableRow>
                </DataTableHead>
                {/*Head*/}
                {data
                  ? data.map((item, index) => {
                      return (
                        <DataTableItem key={index}>
                          <DataTableRow className="nk-tb-col-check">
                            <div className="custom-control custom-control-sm custom-checkbox notext">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                defaultChecked={item.checked}
                                id={item?.id + 'uid1'}
                                key={Math.random()}
                                onChange={(e) => onSelectChange(e, item?.id)}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={item?.id + 'uid1'}
                              ></label>
                            </div>
                          </DataTableRow>
                          <DataTableRow>
                            <Link
                              to={`${process.env.PUBLIC_URL}/lendo/skoring-application-details/${item.id}`}
                            >
                              <div className="user-card">
                                <UserAvatar
                                  theme={item.avatarBg}
                                  className="xs"
                                  text={findUpper(
                                    item?.name ? item?.name : ' '
                                  )}
                                  image={item.image}
                                ></UserAvatar>
                                <div className="user-name">
                                  <span className="tb-lead">
                                    {item.name +
                                      ' ' +
                                      item.family_name +
                                      ' ' +
                                      item.patronymic}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </DataTableRow>

                          <DataTableRow>
                            <span>
                              {item.document_serial + item.document_number}
                            </span>
                          </DataTableRow>
                          <DataTableRow>
                            <span>{item.pinfl}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span>{'+' + item.phone}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span>{item.card_number}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span>{item.card_type}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span>{item.birth_date}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <span
                                className={`tb-status text-${
                                  item.state === 'LIMITED' ||
                                  item.state === 'ACCEPTED' ||
                                  item.state === 'SUCCESS' ||
                                  item.state === 'CONFIRMED'
                                    ? 'success'
                                    : item.state === 'CREATE' ||
                                      item.state === 'SCORING' ||
                                      item.state === 'LIMIT_PROCESS'
                                    ? 'warning'
                                    : 'danger'
                                }`}
                              >
                                {item.state}
                              </span>{' '}
                              {item.state === 'LIMIT_ERROR' && (
                                <TooltipComponent
                                  tag="button"
                                  onClick={() => onErrorClick(item?.message)}
                                  containerClassName="btn btn-trigger btn-icon"
                                  id={'help-fill' + index}
                                  icon="help-fill"
                                  direction="bottom"
                                  text={item?.message}
                                />
                              )}
                            </div>
                          </DataTableRow>

                          {tableHeader
                            .filter((e, i) => i > 7 && e.visible)
                            .map((el, index) => (
                              <DataTableRow key={index}>
                                <span>{item[el.key]}</span>
                              </DataTableRow>
                            ))}

                          <DataTableRow className="nk-tb-col-tools">
                            <ul className="nk-tb-actions gx-1">
                              <li>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    tag="a"
                                    className="dropdown-toggle btn btn-icon btn-trigger"
                                  >
                                    <Icon name="more-h"></Icon>
                                  </DropdownToggle>
                                  <DropdownMenu end>
                                    <ul className="link-list-opt no-bdr">
                                      <li>
                                        <Link
                                          to={`${process.env.PUBLIC_URL}/lendo/skoring-application-details/${item.id}`}
                                        >
                                          <Icon name="view"></Icon>
                                          <span>View</span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </li>
                            </ul>
                          </DataTableRow>
                        </DataTableItem>
                      )
                    })
                  : null}
              </DataTableBody>
            )}

            <div className="card-inner">
              {!(data?.length > 0) && (
                <div className="text-center">
                  <span className="text-silent">
                    {loader ? '...Loading' : 'No data found'}{' '}
                  </span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
      </Content>{' '}
      <ErrorModal
        modal={modal.error}
        closeModal={closeEditModal}
        message={errorMessage}
      />
    </React.Fragment>
  )
}
export default LendoSkoringApplication2
