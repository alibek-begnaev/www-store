import React, { useState } from 'react'
import { Collapse } from 'reactstrap'
import { CodeBlock } from '../../../components/Component'

const RequestAccordion = ({ req, res, className, variation, ...props }) => {
  const [isOpen, setIsOpen] = useState()

  const toggleCollapse = (param) => {
    if (param === isOpen) {
      setIsOpen('0')
    } else {
      setIsOpen(param)
    }
  }
  return (
    <td
      colSpan={4}
      className={[
        `accordion${variation ? ' accordion-s' + variation : ''}${
          className ? ' ' + className : ''
        }`,
      ]}
    >
      {req && (
        <div className="accordion-item">
          <div
            className={[`accordion-head${isOpen !== '1' ? ' collapsed' : ''}`]}
            onClick={() => toggleCollapse('1')}
          >
            <h6 className="title">Request</h6>
            <span className="accordion-icon"></span>
          </div>
          <Collapse
            className="accordion-body"
            isOpen={isOpen === '1' ? true : false}
          >
            <div className="accordion-inner">
              <CodeBlock title={props?.title}>
                {JSON.stringify(JSON.parse(req), false, 2)}
              </CodeBlock>
            </div>
          </Collapse>
        </div>
      )}
      {res && (
        <div className="accordion-item">
          <div
            className={[`accordion-head${isOpen !== '2' ? ' collapsed' : ''}`]}
            onClick={() => toggleCollapse('2')}
          >
            <h6 className="title">Response</h6>
            <span className="accordion-icon"></span>
          </div>
          <Collapse
            className="accordion-body"
            isOpen={isOpen === '2' ? true : false}
          >
            <div className="accordion-inner">
              <CodeBlock title={props.title}>{res}</CodeBlock>
            </div>
          </Collapse>
        </div>
      )}
    </td>
  )
}

export default RequestAccordion
