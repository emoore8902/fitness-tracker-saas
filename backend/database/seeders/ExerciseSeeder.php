<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exercise;
use App\Models\ExerciseCategory;

class ExerciseSeeder extends Seeder
{
    public function run(): void
    {
        $cat = fn(string $name) => ExerciseCategory::where('name', $name)->value('id');

        $exercises = [
            // Chest
            ['name' => 'Bench Press',           'category' => 'Chest',       'muscle_group' => 'Pectorals',         'equipment' => 'Barbell',    'instructions' => 'Lie flat on a bench, lower the bar to your chest, then press upward to full arm extension.'],
            ['name' => 'Incline Dumbbell Press', 'category' => 'Chest',       'muscle_group' => 'Upper Chest',       'equipment' => 'Dumbbell',   'instructions' => 'On an incline bench, press dumbbells from chest level to full extension above your upper chest.'],
            ['name' => 'Push-Up',                'category' => 'Chest',       'muscle_group' => 'Pectorals',         'equipment' => 'Bodyweight', 'instructions' => 'Keep your body straight, lower your chest to the floor, then press back up.'],
            ['name' => 'Cable Fly',              'category' => 'Chest',       'muscle_group' => 'Pectorals',         'equipment' => 'Cable',      'instructions' => 'Stand between cable pulleys, bring handles together in front of your chest in a wide arc.'],

            // Back
            ['name' => 'Deadlift',               'category' => 'Back',        'muscle_group' => 'Posterior Chain',   'equipment' => 'Barbell',    'instructions' => 'Hinge at hips, grip bar just outside legs, drive through heels to stand tall.'],
            ['name' => 'Pull-Up',                'category' => 'Back',        'muscle_group' => 'Latissimus Dorsi',  'equipment' => 'Bodyweight', 'instructions' => 'Hang from a bar with an overhand grip, pull yourself up until chin clears the bar.'],
            ['name' => 'Barbell Row',             'category' => 'Back',        'muscle_group' => 'Rhomboids',         'equipment' => 'Barbell',    'instructions' => 'Hinge forward at the hips, pull the bar to your lower chest keeping elbows close.'],
            ['name' => 'Lat Pulldown',            'category' => 'Back',        'muscle_group' => 'Latissimus Dorsi',  'equipment' => 'Cable',      'instructions' => 'Sit at a cable machine, pull the bar down to your upper chest while squeezing your lats.'],
            ['name' => 'Seated Cable Row',        'category' => 'Back',        'muscle_group' => 'Middle Back',       'equipment' => 'Cable',      'instructions' => 'Sit upright, pull the cable handle to your abdomen while squeezing your shoulder blades together.'],

            // Legs
            ['name' => 'Barbell Squat',           'category' => 'Legs',        'muscle_group' => 'Quadriceps',        'equipment' => 'Barbell',    'instructions' => 'Bar on upper back, squat down until thighs are parallel to the floor, then drive back up.'],
            ['name' => 'Romanian Deadlift',       'category' => 'Legs',        'muscle_group' => 'Hamstrings',        'equipment' => 'Barbell',    'instructions' => 'Hinge at the hips with a slight knee bend, lowering the bar along your shins until you feel a hamstring stretch.'],
            ['name' => 'Leg Press',               'category' => 'Legs',        'muscle_group' => 'Quadriceps',        'equipment' => 'Machine',    'instructions' => 'Sit in the leg press machine, push the platform away until legs are nearly extended, then lower slowly.'],
            ['name' => 'Walking Lunge',           'category' => 'Legs',        'muscle_group' => 'Quadriceps',        'equipment' => 'Dumbbell',   'instructions' => 'Step forward into a lunge, drop the rear knee toward the floor, then step forward with the other leg.'],
            ['name' => 'Leg Curl',                'category' => 'Legs',        'muscle_group' => 'Hamstrings',        'equipment' => 'Machine',    'instructions' => 'Lying face down, curl the weight toward your glutes by flexing your hamstrings.'],
            ['name' => 'Calf Raise',              'category' => 'Legs',        'muscle_group' => 'Calves',            'equipment' => 'Barbell',    'instructions' => 'With weight on your shoulders, rise up onto your toes, hold briefly, then lower.'],

            // Shoulders
            ['name' => 'Overhead Press',          'category' => 'Shoulders',   'muscle_group' => 'Deltoids',          'equipment' => 'Barbell',    'instructions' => 'Press the bar from shoulder height to full arm extension overhead, keeping your core braced.'],
            ['name' => 'Lateral Raise',           'category' => 'Shoulders',   'muscle_group' => 'Deltoids',          'equipment' => 'Dumbbell',   'instructions' => 'With a slight elbow bend, raise dumbbells out to the sides until arms are parallel with the floor.'],
            ['name' => 'Face Pull',               'category' => 'Shoulders',   'muscle_group' => 'Rear Deltoids',     'equipment' => 'Cable',      'instructions' => 'Pull a rope attachment toward your face with elbows flared high and wide to work rear delts.'],

            // Arms
            ['name' => 'Barbell Curl',            'category' => 'Arms',        'muscle_group' => 'Biceps',            'equipment' => 'Barbell',    'instructions' => 'Stand with bar at arm\'s length, curl it up to shoulder height while keeping elbows stationary.'],
            ['name' => 'Hammer Curl',             'category' => 'Arms',        'muscle_group' => 'Biceps',            'equipment' => 'Dumbbell',   'instructions' => 'Hold dumbbells with a neutral grip (palms facing each other), curl upward keeping wrists straight.'],
            ['name' => 'Tricep Pushdown',         'category' => 'Arms',        'muscle_group' => 'Triceps',           'equipment' => 'Cable',      'instructions' => 'Stand at a cable machine, push the bar down until arms are fully extended, then return slowly.'],
            ['name' => 'Skull Crusher',           'category' => 'Arms',        'muscle_group' => 'Triceps',           'equipment' => 'Barbell',    'instructions' => 'Lying on a bench, lower the bar toward your forehead by bending elbows, then press back up.'],

            // Core
            ['name' => 'Plank',                   'category' => 'Core',        'muscle_group' => 'Abdominals',        'equipment' => 'Bodyweight', 'instructions' => 'Hold a push-up position on your forearms, keeping your body in a straight line from head to heel.'],
            ['name' => 'Crunch',                  'category' => 'Core',        'muscle_group' => 'Abdominals',        'equipment' => 'Bodyweight', 'instructions' => 'Lying on your back, curl your shoulders off the floor toward your knees, then lower slowly.'],
            ['name' => 'Russian Twist',           'category' => 'Core',        'muscle_group' => 'Obliques',          'equipment' => 'Bodyweight', 'instructions' => 'Seated with feet raised, twist your torso side to side, optionally holding a weight.'],
            ['name' => 'Hanging Leg Raise',       'category' => 'Core',        'muscle_group' => 'Abdominals',        'equipment' => 'Bodyweight', 'instructions' => 'Hang from a pull-up bar and raise your legs to 90 degrees, then lower with control.'],

            // Cardio
            ['name' => 'Running',                 'category' => 'Cardio',      'muscle_group' => 'Full Body',         'equipment' => 'Bodyweight', 'instructions' => 'Maintain a comfortable pace, keep an upright posture, and breathe rhythmically.'],
            ['name' => 'Rowing Machine',          'category' => 'Cardio',      'muscle_group' => 'Full Body',         'equipment' => 'Machine',    'instructions' => 'Drive with legs first, then lean back, then pull handle to your lower chest; reverse the sequence to return.'],
            ['name' => 'Jump Rope',               'category' => 'Cardio',      'muscle_group' => 'Full Body',         'equipment' => 'Bodyweight', 'instructions' => 'Keep wrists moving in small circles, jump with both feet just high enough for the rope to pass beneath.'],
            ['name' => 'Cycling',                 'category' => 'Cardio',      'muscle_group' => 'Legs',              'equipment' => 'Machine',    'instructions' => 'Adjust seat height so your knee has a slight bend at the bottom of each pedal stroke.'],

            // Flexibility
            ['name' => 'Hip Flexor Stretch',      'category' => 'Flexibility', 'muscle_group' => 'Hip Flexors',       'equipment' => 'Bodyweight', 'instructions' => 'Kneel on one knee, push hips forward gently until you feel a stretch in the front of the rear hip.'],
            ['name' => 'Hamstring Stretch',       'category' => 'Flexibility', 'muscle_group' => 'Hamstrings',        'equipment' => 'Bodyweight', 'instructions' => 'Sit or stand and reach toward your toes, keeping your back as straight as possible.'],
            ['name' => 'Chest Opener Stretch',    'category' => 'Flexibility', 'muscle_group' => 'Pectorals',         'equipment' => 'Bodyweight', 'instructions' => 'Clasp hands behind your back, straighten arms, and gently lift them while opening your chest.'],
        ];

        foreach ($exercises as $data) {
            $categoryId = $cat($data['category']);
            if (!$categoryId) continue;

            Exercise::firstOrCreate(
                ['name' => $data['name'], 'user_id' => null],
                [
                    'exercise_category_id' => $categoryId,
                    'muscle_group'         => $data['muscle_group'],
                    'equipment'            => $data['equipment'],
                    'instructions'         => $data['instructions'],
                ]
            );
        }
    }
}
