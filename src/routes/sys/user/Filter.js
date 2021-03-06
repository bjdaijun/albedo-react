import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch, Select, Radio } from 'antd'
import { parseJsonItemForm } from 'utils'

const RadioGroup = Radio.Group
const Search = Input.Search
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onAdd,
  sysStatus,
  isMotion,
  switchIsMotion,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const { lastModifiedDate } = fields
    if (lastModifiedDate.length) {
      fields.lastModifiedDate = [lastModifiedDate[0].format('YYYY-MM-DD'), lastModifiedDate[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const parseSearchObj = (fields) => {
    let search = [
      { fieldName: 'loginId',
        analytiColumnPrefix: 'a',
        value: fields.loginId,
      }, { fieldName: 'a.status_',
        operate: 'in',
        analytiColumn: false,
        value: (fields.status instanceof Object ? fields.status.target.value : fields.status),
      }, { fieldName: 'lastModifiedDate',
        analytiColumnPrefix: 'a',
        operate: 'between',
        value: fields.lastModifiedDate[0],
        attrType: 'Date',
        format: 'yyyy-MM-dd',
        endValue: fields.lastModifiedDate[1],
      },
    ]
    return search
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(parseJsonItemForm(parseSearchObj(fields)))
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(parseJsonItemForm(parseSearchObj(fields)))
  }
  const { name, status } = filter

  let initialCreateTime = []
  if (filter.lastModifiedDate && filter.lastModifiedDate[0]) {
    initialCreateTime[0] = moment(filter.lastModifiedDate[0])
  }
  if (filter.lastModifiedDate && filter.lastModifiedDate[1]) {
    initialCreateTime[1] = moment(filter.lastModifiedDate[1])
  }
  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        <FilterItem label="登录编号">
          {getFieldDecorator('loginId', { initialValue: name })(<Search size="large" onSearch={handleSubmit} />)}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        <FilterItem label="状态">
          {getFieldDecorator('status', { initialValue: status })(
            <RadioGroup options={sysStatus} onChange={handleChange.bind(null, 'status')} />
          )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
        <FilterItem label="修改时间">
          {getFieldDecorator('lastModifiedDate', { initialValue: initialCreateTime })(
            <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'lastModifiedDate')} />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>查询</Button>
            <Button size="large" onClick={handleReset}>重置</Button>
          </div>
          <div>
            <Switch style={{ marginRight: 16 }} size="large" defaultChecked={isMotion} onChange={switchIsMotion} checkedChildren={'Motion'} unCheckedChildren={'Motion'} />
            <Button size="large" type="ghost" onClick={onAdd}>创建</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
