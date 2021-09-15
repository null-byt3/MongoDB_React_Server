import MongoHandler from '../Mongo/MongoHandler.js';
import { nanoid } from 'nanoid'
import moment from 'moment';


const COOKIE_EXPIRATION_TIME_MINUTES = '10';

export async function authenticate(username, password) {
  const MongoInstance = new MongoHandler();
  const user = await MongoInstance.fetchUser(username);
  if (!user) {
    return {
      success: false,
      error: 'Unknown User',
    }
  }

  if (user.password !== password) {
    return {
      success: false,
      error: 'Invalid Password',
    }
  }

  const sessionId = nanoid();
  const expiresAt = new moment().add(COOKIE_EXPIRATION_TIME_MINUTES, 'minutes').format();
  await MongoInstance.updateUser(username, {
    authentication: {
      sessionId,
      expiresAt,
    }
  })


  return {
    success: true,
    sessionId,
  }

}

export async function validate(username, sessionId) {
  const MongoInstance = new MongoHandler();
  const user = await MongoInstance.fetchUser(username);
  if (!user) {
    return {
      success: false,
      error: 'Invalid User',
    }
  }
  const { authentication } = user;
  if (sessionId === authentication.sessionId && moment().isBefore(authentication.expiresAt)) {
    return {
      success: true,
    }
  }

  return {
    success: false,
    error: 'Invalid Token'
  }
}