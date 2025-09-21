import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Spanish translations for voice configurations
const spanishTranslations = {
  // Voice Groups
  groups: {
    classic: {
      display_name: 'Voces Clásicas',
      description: 'Voces tradicionales y profesionales de terapia para sesiones cotidianas'
    },
    creative: {
      display_name: 'Voces de Personajes', 
      description: 'Voces únicas y atractivas con personalidad para una experiencia más dinámica'
    }
  },
  // Voice Configurations
  voices: {
    male: {
      display_name: 'Voz Masculina',
      description: 'Una voz terapéutica masculina'
    },
    female: {
      display_name: 'Voz Femenina',
      description: 'Una voz terapéutica femenina'
    },
    calm: {
      display_name: 'Voz Tranquila',
      description: 'Una voz más suave y relajante'
    },
    energetic: {
      display_name: 'Voz Energética',
      description: 'Una voz más dinámica y motivadora'
    },
    sass: {
      display_name: 'Sass',
      description: 'Una voz amigable y directa con encanto occidental'
    },
    jacksparrow: {
      display_name: 'Jack Sparrow',
      description: 'Una voz aventurera y carismática como un pirata legendario'
    },
    wizard: {
      display_name: 'Mago',
      description: 'Una voz sabia y misteriosa como un hechicero antiguo'
    },
    robot: {
      display_name: 'Robot',
      description: 'Una voz futurista y tecnológica'
    },
    alien: {
      display_name: 'Alienígena',
      description: 'Una voz extraterrestre y única'
    },
    vampire: {
      display_name: 'Vampiro',
      description: 'Una voz seductora y misteriosa como una criatura de la noche'
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify admin status
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('🚀 Starting voice description updates to Spanish...');

    // Update voice groups
    for (const [groupId, translations] of Object.entries(spanishTranslations.groups)) {
      const { error } = await supabase
        .from('voice_configuration_groups')
        .update({
          display_name: translations.display_name,
          description: translations.description
        })
        .eq('id', groupId);

      if (error) {
        console.error(`❌ Error updating group ${groupId}:`, error);
      } else {
        console.log(`✅ Updated group: ${groupId} -> ${translations.display_name}`);
      }
    }

    // Update voice configurations
    for (const [voiceId, translations] of Object.entries(spanishTranslations.voices)) {
      const { error } = await supabase
        .from('voice_configurations')
        .update({
          display_name: translations.display_name,
          description: translations.description
        })
        .eq('internal_name', voiceId);

      if (error) {
        console.error(`❌ Error updating voice ${voiceId}:`, error);
      } else {
        console.log(`✅ Updated voice: ${voiceId} -> ${translations.display_name}`);
      }
    }

    console.log('🎉 Voice descriptions updated to Spanish successfully!');

    return NextResponse.json({ 
      success: true, 
      message: 'Voice descriptions updated to Spanish successfully' 
    });

  } catch (error) {
    console.error('❌ Error updating voice descriptions:', error);
    return NextResponse.json(
      { error: 'Failed to update voice descriptions' }, 
      { status: 500 }
    );
  }
}
