import styled from 'styled-components'

export const PostContainer = styled.div`
  display: grid;
  grid-template-columns: 72px auto 1fr;
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 22px;
  margin-bottom: 12px;
`

export const PostInner = styled.div`
  grid-column-start: 2;
  grid-row-start: 1;
  grid-column-end: 4;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 22px;
`

export const VoteContainer = styled.div`
  grid-column-start: 1;
  grid-row-start: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 22px;
`

export const LoginBlockerStyle = styled.div`
  grid-row-start: 2;
  grid-column-start: 3;
  display: flex;
  align-items: center;
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
