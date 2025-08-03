import { type NextRequest, NextResponse } from "next/server"
import { signInWithGoogle, signOutUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case "signin":
        const user = await signInWithGoogle()
        return NextResponse.json({
          success: true,
          user: {
            uid: user?.uid,
            email: user?.email,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
          },
        })

      case "signout":
        await signOutUser()
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Firebase auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
