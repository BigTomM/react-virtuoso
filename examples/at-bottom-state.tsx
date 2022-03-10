import { useRef, useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import { Virtuoso } from '../src'
import faker from 'faker'

interface BubbleProps {
  text?: string
  fromUser?: boolean
  className?: string
  height?: string
}

const BubbleWrap = styled.div<{ fromUser?: boolean }>`
  display: flex;
  justify-content: ${({ fromUser }) => fromUser && 'flex-end'};
  width: 100%;
  padding-top: 20px;
  background: ${({ fromUser }) =>fromUser ? '#2e4e37' : '#509161'};;
`

const Content = styled.div<{ fromUser?: boolean ; height :string }>`
  background: ${({ fromUser }) => (fromUser ? 'orange' : '#ad965f')};
  height: ${({ height }) => (height ? height : '80px')};
  color: white;
  width: 60%;
  border-radius: 4px;
  word-break: break-word;
`

function Bubble({ text, fromUser,height, className }: BubbleProps) {
  return (
    <BubbleWrap fromUser={fromUser} className={className}>
      <Content fromUser={fromUser} height={height}>{text}</Content>
    </BubbleWrap>
  )
}

interface ChatListProps {
  messages: { id: string; message: string ;  height?: string }[]
  userId: string
  onSend?: (message: string) => void
  onReceive?: () => void
  height?: number
  placeholder?: string
}

const Root = styled.div<{ fromUser?: boolean }>`
  padding: 12px 24px;
`

const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin-top: 12px;
`

function ChatList({ userId, messages = [], onSend, onReceive, placeholder }: ChatListProps) {
  const [newMessage, setNewMessage] = useState('')
  const ref = useRef(null)
  const isMyOwnMessage = useRef(false)
  const onSendMessage = () => {
    isMyOwnMessage.current = true
    onSend(newMessage)
    setNewMessage('')
  }

  const onReceiveMessage = () => {
    isMyOwnMessage.current = false
    onReceive()
  }

  const onBottom = (state : boolean) => {
    console.log('onBottom state' , state)
  }

  const row = React.useMemo(
    () => (i: number, { message, id,height }: { message: string; id: string ; height? : string }) => {
      const fromUser = id === userId
      return <Bubble key={i} fromUser={fromUser} height={height} />
    },
    [userId]
  )

  return (
    <Root
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid red',
      }}
    >
      <Virtuoso
        ref={ref}
        style={{ flex: 1 }}
        // initialTopMostItemIndex={messages.length - 1}
        itemContent={row}
        data={messages}
        atBottomStateChange={onBottom}
      />
      <TextWrapper style={{ flex: 0, minHeight: 30 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSendMessage()
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage((e.target as HTMLInputElement).value)}
            placeholder={placeholder}
          />
          <button type="submit">send</button> |
          <button type="button" onClick={onReceiveMessage}>
            receive
          </button>
        </form>
      </TextWrapper>
    </Root>
  )
}

const heightMap = {
  // 125: '80px',
  // 125: '80px',
  // 125: '80px',
  // 125: '100px',--
  // 126: '100px',
  // 127: '70px',
  // 128: '150px',
  // 129: '80px',
}

const getData = (num : number) => Array.from({ length: num }, (_ , index) => ({
  id: faker.random.number({ min: 1, max: 2 }).toString(),
  message: faker.lorem.sentences(),
  height : heightMap[index] || '100px'
}))

const Initial_Count = 10

export default function App() {
  const [messages, setMessages] = React.useState(getData(Initial_Count))
  const userId = '1'
  return (
    <div
      style={{
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ChatList
        messages={messages}
        userId="1"
        placeholder="Say hi!"
        // onSend={(message) => setMessages((x) => [...x, { id: userId, message }])}
        // onReceive={() => {
        //   setMessages((x) => [...x, { id: '2', message: faker.lorem.sentences() }])
        // }}
      />
    </div>
  )
}
