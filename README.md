# Toucan Labs - Types & DTOs

This repository contains the TypeScript type definitions, Mongoose schemas, and Data Transfer Object (DTO) transformation logic for the Toucan Labs application. It serves as a centralized place for defining the data structures used across the backend services.
**This is the dependency repository for shared types between our codebase and microservices**

## Making changes

We'll be maintaing a proper release post the launch of v1 for tlabs-communitea, for now, primary objective is to modularize typespace logic between shared microservices like our core backend and chat microservice

## Overview

The project is structured to separate Mongoose schema definitions from the DTOs used for API responses and the transformation logic between them. This promotes:

* **Clear Separation of Concerns**: Database schemas are distinctly defined here and used in other services
* **Type Safety**: Leverages TypeScript for robust type checking.
* **Maintainability**: Easier to manage and update data structures.

## Core Entities

The primary data models defined in this project include:

* **User**: Represents users of the application, including authentication details and profile information.
  * Schema: [`src/types/User.ts`](src/types/User.ts)
  * DTOs & Types: [`src/userDTO/types.ts`](src/userDTO/types.ts)
  * Transform: [`src/userDTO/UserTransform.ts`](src/userDTO/UserTransform.ts)
* **Organization**: Represents organizations or teams within the application.
  * Schema: [`src/types/Organization.ts`](src/types/Organization.ts)
  * DTOs & Types: [`src/organizationDTO/types.ts`](src/organizationDTO/types.ts)
  * Transform: [`src/organizationDTO/OrganizationTransform.ts`](src/organizationDTO/OrganizationTransform.ts)
* **Conversation**: Manages communication channels, both direct messages and group channels.
  * Schema: [`src/types/Conversation.ts`](src/types/Conversation.ts)
  * DTOs & Types: [`src/conversationDTO/types.ts`](src/conversationDTO/types.ts)
  * Transform: [`src/conversationDTO/ConversationTransform.ts`](src/conversationDTO/ConversationTransform.ts)
* **Message**: Represents individual messages within conversations, supporting replies and metadata.
  * Schema: [`src/types/Message.ts`](src/types/Message.ts)
  * DTOs & Types: [`src/messagesDTO/types.ts`](src/messagesDTO/types.ts)
  * Transform: [`src/messagesDTO/MessageTransform.ts`](src/messagesDTO/MessageTransform.ts)

## Considerations about transformations

The transform functions are defined such that they take in an input Document object (any object that implements the document interface) and they give a DTO object that can be consumed in the frontend

**DTO's ensure that frontend safe types are present in the object and backend specific types are either removed or converted to compatible types**

When in need of populating reference fields / virtual fields (like Reply), typescript needs to be made aware of these populated types because although mongoose makes them available at runtime, typescript has no idea that the fields are populated

**Eg: If you fetch a Conversation document and you call .populate() on any of it's reference fields (like Participants)**

```typescript
const conversation = await Conversation.findById(id)
  .populate<{ participants: IUserDocument[] }>('participants');
```

This tells typescript that after population is done, the participants property will not be an array of Types.ObjectId's but that of IUserDocument

Adhere to the type structure accepted by each transformation function to avoid runtime errors.

## Using .lean() and .select()

When using lean() and select() functions, again, we need to make typescript aware of the changes in types of the fetched 'Results' from mongodb.

**What does this mean?**
We have 4 kinds of interfaces/types defined here

* **DTO**: These are data transformation types, that convert server types to client types for client consumption

* **I__Document**: They are the types/interfaces of the actual documents stored in the mongodb database

* **I__**: They are the type of objects, also known as ***POJO*** or ***Plain Old JavaScript Objects***. It's not always possible to fetch entire mongoose documents from the db, so we perform .lean() fetches for read only/view related operations/api calls. These types represent structure of a .lean() query

* **Create__**: These types are the same as **I__** types, but I've changed their names so that we understand that they can be used to construct objects that can be used to create mongo documents
  
```typescript
import Message from "path/to/our/msg_models/file";
const newMessage: createMessage = {};//msg data
const newMessageDocument: IMessageDocument = await Message.create(newMessage);
```

### Examples of .lean() and .select()

* **When to use generics in lean:**
  Use a generic in .lean<T>() when:

  You want TypeScript to understand the shape of the final plain object returned by Mongoose.
  You want to avoid manual type assertions (as) later.
  What the generic means:

  **It tells TypeScript:**
  *"This query will return a plain JS object shaped like type T."*

* **When to use generics in select:**
  Use a generic in .select<T>() when:
  You want TypeScript to understand the shape of the final document returned by Mongoose.
  You will get a Mongoose Document
  Only selected fields are included (other fields like password, etc. are excluded)

  **It tells TypeScript:**
  "This query will return a document shaped like type T."*

**Lean**

```typescript
const message = await Message.findById(id)
  .lean<IMessage>()
  .exec();

if (message) {
  // message is typed as IMessage (no Mongoose methods)
  console.log(message.content);
}
```

**Select**

```typescript
type SelectedMessageFields = Pick<IMessage, '_id' | 'content'>;

const message = await Message.findById(id)
  .select<SelectedMessageFields>('_id content')
  .exec();

// message: { _id: ObjectId; content: string }

```

### Using .populate()

**When to use generics:**
Use a generic in .populate<T>() when:

You want TypeScript to understand what type the populated field becomes.
You’re populating a field that’s normally an ObjectId, but will now be a full object.

**It tells TypeScript:**
*"Hey, after populating, treat this path as type T instead of ObjectId."*

```typescript
const post = await Post.findById(id)
  .populate<{ author: IUser }>({ path: 'author' }) 
  .lean<IPost & { author: IUser }>();
console.log(post?.author.email); 
```

## Structure

The project is organized into the following main directories under `src/`:

* `types/`: Contains Mongoose schema definitions for each core entity.
* `messagesDTO/`, `conversationDTO/`, `organizationDTO/`, `userDTO/`: Each of these directories contains:
  * `types.ts`: TypeScript interfaces for the database documents (`IMessageDocument`, `IUserDocument`, etc.) and the DTOs (`MessageDTO`, `UserDTO`, etc.) intended for client-server communication.
  * `Transform.ts` (e.g., `MessageTransform.ts`): Functions to convert Mongoose document instances into their corresponding DTOs.

## Key Features & Patterns

* **DTO Transformation**: Dedicated transform functions (e.g., `transformToMessageDTO`) are used to map Mongoose documents to clean DTOs. This allows for controlled exposure of data and formatting (e.g., converting `_id` to `id`, `Date` objects to ISO strings).
* **Virtual Population**: The `Message` schema uses a virtual field `replies` which is automatically populated via a `pre(/^find/)` Mongoose hook. This allows for fetching message threads efficiently.
* **Timestamp Handling**: Most schemas use Mongoose's built-in `timestamps: true` option or manually define `createdAt` and `updatedAt` fields.
* **Conditional Requirements**: The `Conversation` schema demonstrates conditional field requirements based on the `type` of conversation (e.g., `participants` required for `direct` type, `name` for `channel` type).
* **Unique Keys for Direct Messages**: The `Conversation` schema generates a `uniqueKey` for direct messages based on sorted participant IDs to prevent duplicate DM channels between the same set of users.
* **Type Safety for Enums**: String enums like `TYPE_OF_CHANNEL` and `ROLES` are defined using `as const` for better type inference and safety.

## Usage

These types and schemas are intended to be imported and used by other backend services that interact with the MongoDB database.

**Example (Conceptual):**

```typescript
// In another service
import { userSchema } from 'types'; // Assuming this package is published or linked
import mongoose from 'mongoose';

const User = mongoose.model('User', userSchema);

async function getUserDTO(userId: string) {
  const userDoc = await User.findById(userId);
  if (userDoc) {
    // Assuming transformToUserDTO is also exported and available
    return transformToUserDTO(userDoc); 
  }
  return null;
}
```

## Note:

While fetching Messages, **do not use .lean()**
Message fetching has a prehook that populates replies whenever a fetch query is made as IMessageDocument,
Using .lean() will cause replies to be IMessage whereas it's defined to be IMessageDocument.
When creating Messages, use CreateMessage type
Use IMessageDocument as a type when fetching message documents from db
(use select to specify types but don't use .lean())