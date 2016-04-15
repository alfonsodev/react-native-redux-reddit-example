import React, { Component, PropTypes, View, Text, Picker } from 'react-native'
import { connect } from 'react-redux'
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit } from '../actions'
import Posts from '../components/Posts'

class AsyncApp extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = nextProps
      dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }
  }

  handleChange(nextSubreddit) {
    console.log('next ')
    this.props.dispatch(selectSubreddit(nextSubreddit))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedSubreddit } = this.props
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  render() {
    const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props
    return (
      <View>
      <Picker
        selectedValue={selectedSubreddit}
        onValueChange={(subreddit) => { this.handleChange(subreddit) } }>
        <Picker.Item label="Reactjs" value="reactjs" />
        <Picker.Item label="Frontend" value="frontend" />
      </Picker>
      {lastUpdated &&
        <Text>Last updated at {new Date(lastUpdated).toLocaleTimeString()}. {' '}
        </Text>
      }
      {isFetching && posts.length === 0 && <Text>Loading...</Text> }
      {!isFetching && posts.length === 0 && <Text>Empty.</Text> }
      {posts.length > 0 &&
        <View style={{ opacity: isFetching ? 0.5 : 1 }}>
          <Posts posts={posts} />
        </View>
      }
      </View>

    )
  }
}

AsyncApp.propTypes = {
  selectedSubreddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedSubreddit, postsBySubreddit } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsBySubreddit[selectedSubreddit] || {
    isFetching: true,
    items: []
  }

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(AsyncApp)
