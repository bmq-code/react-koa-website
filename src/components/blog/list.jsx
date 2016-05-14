import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Brief from './brief'
import Pagination from './pagination'

class List extends Component {
  render() {
    const { list } = this.props
    return (
      <div>
        {list.map((value) => {
          return (
            <Brief key={value.date} data={value} />
          )
        })}
        <Pagination />
      </div>
    )
  }
}
List.propTypes = {
  list: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  const { list } = state.bloglist
  return {
    list
  }
}

export default connect(mapStateToProps)(List)