# Blok Web - Convex Setup Complete! 🎉

## What's Set Up

### Database Schema
- **Users** - name, email, avatar, bio
- **Groups** - organizations with members
- **Events** - calendar events (personal or group)
- **GroupMembers** - junction table for group membership
- **EventAttendees** - junction table for event invitations

### API Functions Created

**Users** (`convex/users.ts`):
- `list` - Get all users
- `getById` - Get user by ID
- `search` - Search users by name/email
- `create` - Create new user
- `update` - Update user profile

**Groups** (`convex/groups.ts`):
- `list` - Get all groups
- `getById` - Get group with creator info
- `getUserGroups` - Get groups for a user
- `getMembers` - Get group members
- `create` - Create group
- `addMember` - Add member to group
- `removeMember` - Remove member

**Events** (`convex/events.ts`):
- `getUserEvents` - Get user's events with date filtering
- `getGroupEvents` - Get group's events
- `getById` - Get event with attendees
- `create` - Create event with attendees
- `update` - Update event
- `remove` - Delete event
- `respondToInvite` - Accept/decline event invitation

## Next Steps

1. **Start Convex dev server**:
   ```bash
   npx convex dev
   ```

2. **View your dashboard**: https://dashboard.convex.dev/d/quaint-woodpecker-180

3. **Example usage in components**:
   ```javascript
   import { useQuery, useMutation } from 'convex/react';
   import { api } from '../convex/_generated/api';
   
   // In your component:
   const users = useQuery(api.users.list);
   const createUser = useMutation(api.users.create);
   ```

## Environment Variables
Your `.env.local` file has been created with:
- `REACT_APP_CONVEX_URL` - Client URL
- `REACT_APP_CONVEX_SITE_URL` - HTTP Actions URL

Ready to build! 🚀
