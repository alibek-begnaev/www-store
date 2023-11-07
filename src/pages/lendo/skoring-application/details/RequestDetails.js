import React, { useEffect, useState } from 'react'
import { Collapse } from 'reactstrap'
import { CodeBlock } from '../../../../components/Component'
import { dataInstance2 } from '../../../../utils/axios'

const RequestDetails = ({ appId, className, variation, ...props }) => {
  const [isOpen, setIsOpen] = useState({ req: true, res: true })
  const [request, setRequest] = useState({
    req: '',
    res: '',
  })
  const toggleCollapse = (param) => {
    setIsOpen({ ...isOpen, [param]: !isOpen[param] })
  }
  const fetchData = () => {
    const id = appId
    dataInstance2
      .get('/requests-by-id/' + id)
      .then((res) => {
        console.log(res?.data?.done)
        setRequest({
          req: res?.data?.done?.request,
          res: res?.data?.done?.response,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {request?.req && (
        <div className="accordion-item">
          <div
            className={[`accordion-head${isOpen['req'] ? ' collapsed' : ''}`]}
            onClick={() => toggleCollapse('req')}
          >
            <h6 className="title">Request</h6>
            <span className="accordion-icon"></span>
          </div>
          <Collapse
            className="accordion-body"
            isOpen={isOpen['req'] ? true : false}
          >
            <div className="accordion-inner">
              <CodeBlock title={props?.title}>
                {JSON.stringify(JSON.parse(request?.req), false, 2)}
              </CodeBlock>
            </div>
          </Collapse>
        </div>
      )}
      {request?.res && (
        <div className="accordion-item">
          <div
            className={[`accordion-head${isOpen['res'] ? ' collapsed' : ''}`]}
            onClick={() => toggleCollapse('res')}
          >
            <h6 className="title">Response</h6>
            <span className="accordion-icon"></span>
          </div>
          <Collapse
            className="accordion-body"
            isOpen={isOpen['res'] ? true : false}
          >
            <div className="accordion-inner">
              <CodeBlock title={props.title}>{request?.res}</CodeBlock>
            </div>
          </Collapse>
        </div>
      )}
    </>
  )
}

export default RequestDetails
