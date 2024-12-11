import styled from 'styled-components'

export const PostContainer = styled.div`
  background-color: #1e1e1e;
  flex-wrap: wrap;
  border-radius: 8px;
  padding: 22px;
  margin-bottom: 12px;
  flex-direction: row;
  display: flex;
`

export const PostBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
`

export const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 22px;
`

export const VoteValue = styled.div`
  font-size: 1.5rem;
  margin: 0 8px;
`

export const ContentStyle = styled.div`
  flex: 1;
`
export const ActionsStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`
