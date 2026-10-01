import { NextResponse } from 'next/server';
import { INITIAL_APPS } from '@/data/initialApps';
import { AppItem } from '@/types/app';

// In-memory runtime cache for server persistence
let appsDatabase: AppItem[] = [...INITIAL_APPS];

export async function GET() {
  return NextResponse.json({
    success: true,
    apps: appsDatabase,
    total: appsDatabase.length
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.name) {
      return NextResponse.json({ success: false, error: 'App name is required' }, { status: 400 });
    }

    const newApp: AppItem = {
      ...body,
      id: body.id || 'app-' + Date.now(),
      createdAt: Date.now()
    };

    appsDatabase.unshift(newApp);

    return NextResponse.json({
      success: true,
      app: newApp,
      message: 'Application published successfully'
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.id) {
      return NextResponse.json({ success: false, error: 'App ID is required' }, { status: 400 });
    }

    const index = appsDatabase.findIndex((a) => a.id === body.id);
    if (index === -1) {
      // If not in memory, append it
      appsDatabase.unshift(body);
    } else {
      appsDatabase[index] = { ...appsDatabase[index], ...body };
    }

    return NextResponse.json({
      success: true,
      app: body,
      message: 'Application updated successfully'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'App ID is required' }, { status: 400 });
    }

    appsDatabase = appsDatabase.filter((a) => a.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

