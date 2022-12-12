import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import LeaderboardTable from '../LeaderboardTable'
import {
  LeaderboardContainer,
  LoadingViewContainer,
  ErrorMessage,
} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Leaderboard = () => {
  const [apiResponse, setApiResponsive] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })
  useEffect(() => {
    const getLeaderboardData = async () => {
      setApiResponsive({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      })
      const url = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }
      const response = await fetch(url, options)
      const responseData = await response.json()
      if (response.ok) {
        const updatedData = responseData.leaderboard_data.map(item => ({
          id: item.id,
          rank: item.rank,
          name: item.name,
          language: item.language,
          score: item.score,
          profileImgUrl: item.profile_image_url,
          timeSpent: item.time_spent,
        }))
        setApiResponsive(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.success,
          data: updatedData,
        }))
      } else {
        setApiResponsive(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.failure,
          errorMsg: responseData.error_msg,
        }))
      }
    }
    getLeaderboardData()
  }, [])

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  )
  const renderSuccessView = () => {
    const {data} = apiResponse
    return <LeaderboardTable leaderboardData={data} />
  }
  const renderFailureView = () => {
    const {errorMsg} = apiResponse
    return <ErrorMessage>{errorMsg}</ErrorMessage>
  }

  const renderLeaderboard = () => {
    const {status} = apiResponse
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
