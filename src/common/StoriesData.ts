import { StoryCategory, EnhancedStory, Story } from '../types';

// Enhanced story data with additional fields
const enhancedStoriesData: { categories: StoryCategory[] } = {
  categories: [
    {
      id: "1",
      name: "Fairy Tales",
      description: "Classic fairy tales that spark imagination and teach valuable lessons",
      color: "#FF6B9D",
      icon: "auto-fix-high",
      stories: [
        {
          id: "101",
          title: "The Little Red Riding Hood",
          description: "A young girl ventures into the dark woods to visit her grandmother, carrying a basket of treats. Along the way, she encounters a cunning wolf who plots to deceive her. This timeless tale of caution and cleverness teaches us the importance of staying alert and listening to wise advice.",
          image: "https://images.unsplash.com/vector-1738590592643-6c848d2a02f2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `Once upon a time, there was a little girl who lived with her mother in a small cottage at the edge of a great forest. Everyone called her Little Red Riding Hood because she always wore a beautiful red cloak with a hood that her grandmother had made for her.

One sunny morning, her mother said, "Little Red Riding Hood, your grandmother is feeling unwell. Please take this basket of fresh bread, butter, and honey cakes to her cottage in the woods. But remember, stay on the path and don't talk to strangers."

Little Red Riding Hood promised to be careful and set off through the forest with her basket. The path wound through tall trees and colorful wildflowers. Birds sang sweetly overhead, and butterflies danced around her.

As she walked along, a sly wolf appeared from behind a large oak tree. "Good morning, little girl," said the wolf with a friendly smile. "Where are you going on this beautiful day?"

Little Red Riding Hood, forgetting her mother's warning, replied, "I'm going to visit my grandmother who lives in the cottage by the big pine tree. She's not feeling well, so I'm bringing her some treats."

The wolf's eyes gleamed. "How thoughtful of you! I know a shortcut through the forest. Why don't you pick some of those lovely flowers for your grandmother while I show you the way?"

While Little Red Riding Hood gathered flowers, the cunning wolf raced ahead to grandmother's cottage. He knocked on the door and disguised his voice to sound like the little girl.

"Who's there?" called grandmother from her bed.

"It's Little Red Riding Hood, grandmother. I've brought you some treats."

"Come in, dear. The door is unlocked."

The wolf rushed in and, before grandmother could cry out, he locked her safely in the closet. Then he put on her nightgown and cap and climbed into her bed, pulling the covers up to his chin.

Soon, Little Red Riding Hood arrived at the cottage and knocked on the door.

"Come in, my dear," called the wolf in his best grandmother voice.

Little Red Riding Hood entered and approached the bed, but something seemed strange about her grandmother.

"Grandmother, what big eyes you have!" she said.

"All the better to see you with, my dear," replied the wolf.

"Grandmother, what big ears you have!"

"All the better to hear you with, my dear."

"Grandmother, what big teeth you have!"

"All the better to eat you with!" growled the wolf, throwing off the covers.

Little Red Riding Hood screamed and ran toward the door, but just then, a woodsman who had been working nearby heard the commotion and burst into the cottage with his axe.

"What's going on here?" he shouted.

The wolf, frightened by the woodsman's loud voice and sharp axe, immediately released grandmother from the closet and ran out of the cottage as fast as his legs could carry him, never to bother anyone in that forest again.

Grandmother hugged Little Red Riding Hood tightly. "Thank you for bringing me these wonderful treats, dear. And thank you, kind woodsman, for rescuing us."

From that day forward, Little Red Riding Hood always remembered her mother's advice: stay on the path and never talk to strangers. And she lived happily ever after, visiting her grandmother safely many more times.

The End.`,
          readingTime: 8,
          ageGroup: "4-8 years",
          tags: ["classic", "fairy tale", "caution", "family", "forest"],
          isFavorite: false,
          readCount: 0,
          category: "1"
        },
        {
          id: "102",
          title: "Cinderella",
          description: "Cinderella lives under the cruel watch of her stepmother and stepsisters, dreaming of a life beyond her chores. With a sprinkle of magic from her fairy godmother, she attends the royal ball and captures the prince's heart. A story that shows kindness and hope can transform even the most difficult lives.",
          image: "https://images.unsplash.com/vector-1738590592643-6c848d2a02f2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `Once upon a time, in a beautiful kingdom, there lived a kind and gentle girl named Cinderella. After her father passed away, she lived with her stepmother and two stepsisters, who were very mean to her.

Every day, Cinderella had to clean the house, cook the meals, and do all the chores while her stepsisters spent their time trying on pretty dresses and jewelry. Despite all the hard work, Cinderella remained cheerful and kind to everyone, including the little mice who lived in the house.

One day, a royal messenger arrived with exciting news. "Hear ye, hear ye! The Prince is having a grand ball at the palace, and every young lady in the kingdom is invited!"

Cinderella's stepsisters were thrilled. They spent days choosing their finest gowns and practicing their curtsies. "Cinderella," said her stepmother, "you must help your sisters get ready. Polish their shoes, press their dresses, and style their hair."

"But what about me?" asked Cinderella hopefully. "May I go to the ball too?"

Her stepmother laughed cruelly. "You? In those rags? Don't be silly. You have far too much work to do here."

On the night of the ball, after helping her stepfamily leave in their fancy carriage, Cinderella sat by the fireplace and began to cry. "I wish I could go to the ball too," she whispered.

Suddenly, a warm, sparkling light filled the room, and a kind woman appeared. "Don't cry, dear child. I am your Fairy Godmother, and you shall go to the ball!"

With a wave of her magic wand, the Fairy Godmother transformed a pumpkin into a golden carriage, mice into white horses, and a rat into a coachman. Then she turned to Cinderella.

"Now for you, my dear." Another wave of the wand, and Cinderella's torn dress became a magnificent ball gown of silver and blue, sparkling like starlight. On her feet appeared delicate glass slippers.

"You look beautiful!" said the Fairy Godmother. "But remember, the magic will end at midnight. You must leave before the clock strikes twelve, or everything will return to the way it was."

At the palace, Cinderella was the most beautiful girl at the ball. The Prince asked her to dance, and they danced together all evening. Cinderella was so happy that she forgot about time until she heard the clock beginning to chime midnight.

"I must go!" she cried, running down the palace steps. In her hurry, one glass slipper fell off, but she couldn't stop to pick it up.

The Prince found the glass slipper and declared, "I will marry the girl whose foot fits this slipper perfectly!"

For days, the Prince visited every house in the kingdom. Cinderella's stepsisters tried to squeeze their feet into the slipper, but it was too small for them.

When the Prince arrived at Cinderella's house, she was in the kitchen, but she asked, "May I try the slipper too?"

Her stepmother scoffed, "Don't waste the Prince's time!"

But the Prince insisted. The glass slipper fit Cinderella's foot perfectly! As proof, she pulled out the matching slipper from her apron pocket.

The Prince recognized her immediately as the beautiful girl from the ball. "Will you marry me?" he asked.

"Yes," said Cinderella, her heart full of joy.

They were married in a grand ceremony, and Cinderella, who had always been kind and good, became a beloved princess. She even forgave her stepfamily and invited them to live in the palace.

And they all lived happily ever after.

The End.`,
          readingTime: 12,
          ageGroup: "4-10 years",
          tags: ["classic", "fairy tale", "magic", "kindness", "transformation"],
          isFavorite: false,
          readCount: 0,
          category: "1"
        }
      ]
    },
    {
      id: "2",
      name: "Adventure",
      description: "Exciting adventures that inspire courage and exploration",
      color: "#4ECDC4",
      icon: "explore",
      stories: [
        {
          id: "201",
          title: "Treasure Island",
          description: "Young Jim Hawkins stumbles upon a pirate's map, setting sail on a perilous voyage in search of hidden treasure. Battles, betrayal, and mysterious islands await him as he learns the meaning of courage. This classic adventure sweeps you into a world of swashbuckling excitement and daring quests.",
          image: "https://images.unsplash.com/vector-1738590592643-6c848d2a02f2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `Jim Hawkins was just an ordinary boy helping his mother run the Admiral Benbow Inn by the sea. Life was quiet until the day a mysterious old sailor arrived with a heavy sea chest and a warning: "Keep a weather eye open for a seafaring man with one leg."

The old sailor, Billy Bones, spent his days drinking rum and telling wild tales of pirates and treasure. But one stormy night, he died suddenly, leaving behind his precious sea chest.

Inside the chest, Jim discovered an old map marked with an X. "Mother, look!" he exclaimed. "It's a treasure map!"

The map showed an island far across the ocean, with detailed markings leading to buried treasure. Jim's eyes sparkled with excitement as he traced the path with his finger.

Soon, Jim found himself aboard the ship Hispaniola with Squire Trelawney and Dr. Livesey, sailing toward the mysterious island. The crew seemed friendly enough, especially the ship's cook, Long John Silver, who had only one leg and walked with a crutch.

"Ah, Jim lad," Silver would say with a smile, "you remind me of myself when I was young and eager for adventure."

But as they neared the island, Jim overheard a frightening conversation. Long John Silver was actually the leader of a group of pirates planning to steal the treasure for themselves!

"When we reach the island," Silver whispered to his men, "we'll get rid of the squire and the doctor, take the treasure, and sail away rich men!"

Jim's heart pounded as he realized the danger they were all in. He had to warn his friends, but how could he do it without the pirates discovering he knew their secret?

When they reached Treasure Island, Jim managed to slip away and warn Dr. Livesey and Squire Trelawney. Together, they found an old stockade on the island where they could defend themselves.

The pirates, led by Long John Silver, attacked the stockade, but Jim and his friends fought bravely. During the battle, Jim snuck away to find the treasure on his own.

Following the map through dense jungle and over rocky hills, Jim finally reached the spot marked with an X. But when he began to dig, he heard footsteps behind him.

"Well, well, Jim lad," came Long John Silver's voice. "Found the treasure, have you?"

Jim spun around to see Silver approaching with several pirates. His heart sank – he was trapped!

But as Silver's men began to dig, they made a shocking discovery. The treasure chest was empty except for a few old coins!

"Someone's been here before us!" shouted one of the pirates angrily.

Just then, Dr. Livesey and Squire Trelawney appeared from behind the trees with several loyal sailors. "The treasure is safe aboard our ship," called Dr. Livesey. "We found it days ago!"

The pirates, realizing they had been outsmarted, surrendered. Long John Silver, impressed by Jim's courage, decided to give up his pirate ways.

"You're a brave lad, Jim Hawkins," Silver said as they sailed back home. "You've taught this old pirate that there's more treasure in friendship and honor than in all the gold in the world."

Jim returned home with enough treasure to help his mother keep the inn running comfortably. But more importantly, he had learned that real treasure comes from courage, loyalty, and standing up for what's right.

And whenever young visitors came to the Admiral Benbow Inn, Jim would tell them tales of his great adventure, inspiring them to be brave and true in their own lives.

The End.`,
          readingTime: 15,
          ageGroup: "8-12 years",
          tags: ["adventure", "pirates", "treasure", "courage", "friendship"],
          isFavorite: false,
          readCount: 0,
          category: "2"
        },
        {
          id: "202",
          title: "The Jungle Book",
          description: "Raised by wolves in the heart of the jungle, Mowgli grows up learning the laws of nature under the watchful eyes of Baloo and Bagheera. As he encounters fierce predators and thrilling escapades, he discovers where he truly belongs. A vibrant story about friendship, survival, and identity.",
          image: "https://images.unsplash.com/vector-1738590592643-6c848d2a02f2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `Deep in the heart of the Indian jungle, where ancient trees reached toward the sky and exotic flowers bloomed in every color imaginable, lived a very special boy named Mowgli.

Mowgli wasn't like other children. When he was just a baby, he had been found alone in the jungle by a family of wolves. Mother Wolf and Father Wolf took him in as their own cub, raising him alongside their wolf children.

"This man-cub will be called Mowgli," said Mother Wolf lovingly. "He will run with the pack and learn the ways of the jungle."

As Mowgli grew, he learned to speak the language of the animals and follow the Law of the Jungle. His best friends were Baloo, a wise and gentle bear who taught him about the plants and animals of the forest, and Bagheera, a sleek black panther who had once lived with humans and understood both worlds.

"Remember, little brother," Bagheera would tell him, "the jungle has many dangers. You must be clever and brave to survive."

Baloo taught Mowgli which fruits were safe to eat, how to find fresh water, and the calls of different birds. "The bare necessities of life will come to you," Baloo would sing as they wandered through the forest together.

But not everyone in the jungle was friendly to Mowgli. Shere Khan, a fierce tiger with a hatred for humans, prowled the forest looking for the man-cub.

"That human child does not belong here," Shere Khan would growl. "One day, he will bring other humans to destroy our jungle home."

One day, while Mowgli was playing by the river, he heard Bagheera calling urgently. "Mowgli! Come quickly! Shere Khan is coming this way, and he's very angry."

Mowgli climbed high into a tree just as the great tiger appeared. Shere Khan's yellow eyes gleamed as he sniffed the air.

"I know you're here, man-cub," Shere Khan called. "You cannot hide from me forever."

But Mowgli was clever. He had learned from watching the monkeys how to swing from branch to branch. Silently, he moved through the treetops until he was far from the dangerous tiger.

As the years passed, Mowgli grew stronger and more skilled in jungle ways. He could climb like a monkey, swim like a fish, and run as silently as a panther. The jungle animals respected him, and many became his friends.

One day, while exploring a part of the jungle he had never seen before, Mowgli heard strange sounds. Following the noise, he discovered a village where humans lived in huts and tended fires.

"Those are your people, Mowgli," said Bagheera, who had followed him. "Perhaps it is time for you to learn about the world of humans too."

Mowgli watched the village children playing and saw how they lived. Part of him was curious, but his heart belonged to the jungle.

"I am happy here with you, Bagheera, and Baloo, and my wolf family," Mowgli said. "The jungle is my home."

But Bagheera was wise and knew that someday Mowgli might need to choose between the jungle and the human world.

That day came sooner than expected. Shere Khan had gathered other tigers and was planning to drive all humans away from the jungle forever. The wolf pack was in danger because they had protected Mowgli.

"I must face Shere Khan," Mowgli declared bravely. "I won't let him hurt my family."

Using his knowledge of both human and animal ways, Mowgli devised a clever plan. He led Shere Khan to the edge of the village, where the humans had built a large fire. Tigers fear fire above all else.

"You want to fight me, Shere Khan?" Mowgli called out, holding a burning branch. "Then face the Red Flower that you fear so much!"

Shere Khan, terrified of the fire, fled deep into the jungle and was never seen again.

The village people welcomed Mowgli, amazed by his courage and his ability to speak with animals. But after spending time with them, Mowgli realized something important.

"I belong to both worlds," he told Baloo and Bagheera. "I am part human and part jungle. I will spend time in the village to learn human ways, but the jungle will always be my true home."

And so Mowgli lived happily, moving between the village and the jungle, serving as a bridge between the human and animal worlds. He used his unique gifts to help both communities understand and respect each other.

The jungle animals knew they could always count on their brave friend Mowgli, and the village people learned to appreciate the wisdom and beauty of the natural world around them.

The End.`,
          readingTime: 18,
          ageGroup: "6-12 years",
          tags: ["adventure", "jungle", "animals", "friendship", "belonging"],
          isFavorite: false,
          readCount: 0,
          category: "2"
        }
      ]
    },
    {
      id: "3",
      name: "Moral Stories",
      description: "Timeless tales that teach important life lessons and values",
      color: "#45B7D1",
      icon: "favorite",
      stories: [
        {
          id: "301",
          title: "The Boy Who Cried Wolf",
          description: "A mischievous shepherd boy repeatedly tricks villagers by shouting that a wolf is attacking his flock. When a real wolf appears and he cries for help, no one believes him. This simple yet powerful tale reminds us that honesty is the best policy.",
          image: "https://images.unsplash.com/vector-1738590592643-6c848d2a02f2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `In a peaceful village nestled between rolling green hills, there lived a young shepherd boy named Peter. Every day, Peter's job was to take the village sheep up to the hillside pasture and watch over them while they grazed.

At first, Peter enjoyed his job. He liked being outdoors, watching the fluffy white clouds drift across the blue sky, and listening to the gentle bleating of the sheep. But after a few weeks, he began to feel bored and lonely on the quiet hillside.

"I wish something exciting would happen," Peter sighed as he sat on a large rock, watching the sheep nibble grass.

One particularly quiet afternoon, Peter had a mischievous idea. "I know how to make things more interesting," he thought with a grin.

Standing up on his rock, Peter cupped his hands around his mouth and shouted as loudly as he could: "WOLF! WOLF! A wolf is attacking the sheep! Help me!"

Down in the village, the farmers heard Peter's cries and immediately dropped what they were doing. They grabbed their tools and ran up the hill as fast as they could to help the boy and save the sheep.

When they reached the pasture, breathing hard from their run, they found Peter laughing and all the sheep grazing peacefully.

"Where's the wolf?" asked one of the farmers, looking around anxiously.

"There is no wolf," Peter giggled. "I was just having some fun. You should have seen how fast you all ran!"

The farmers were not amused. "Peter, that wasn't funny," said the village blacksmith sternly. "We were worried about you and the sheep. Don't cry wolf when there's no danger."

But Peter just shrugged and continued to laugh as the frustrated farmers walked back down the hill.

A few days later, Peter was feeling bored again. "That was so much fun last time," he thought. "I think I'll do it again."

Once more, he stood on his rock and shouted: "WOLF! WOLF! Please help me! The wolf is chasing the sheep!"

Again, the kind villagers dropped everything and rushed up the hill to help. And again, they found Peter laughing and no wolf in sight.

"Peter!" said the village baker, shaking her head. "This is the second time you've tricked us. We have important work to do. You must not lie to us."

"It's just a joke," Peter said, still giggling. "You're all so easy to fool!"

The villagers walked away, shaking their heads and muttering about the dishonest boy.

The next week, Peter was sitting on his rock feeling particularly mischievous when he heard a rustling in the nearby bushes. He was about to call out another fake wolf warning when suddenly, a large, gray wolf with gleaming yellow eyes stepped out from behind the trees.

The wolf looked hungrily at the flock of sheep, licking its lips. Peter's heart began to pound with real fear.

"Oh no," Peter whispered. "This time it's real!"

The wolf began to stalk toward the sheep, who sensed danger and started to bleat nervously. Peter knew he had to act quickly.

"WOLF! WOLF!" Peter shouted desperately. "Please help me! There's really a wolf this time! It's going to attack the sheep!"

Down in the village, the farmers heard Peter's cries, but this time they just shook their heads.

"There goes Peter again with his silly jokes," said the blacksmith.

"That boy has cried wolf too many times," agreed the baker. "We're not falling for his tricks anymore."

"Let him handle his imaginary wolf by himself," said another farmer.

No one came to help.

Meanwhile, on the hillside, the wolf was getting closer to the sheep. Peter shouted louder and louder, but no one believed him anymore.

"HELP! PLEASE! THE WOLF IS REAL THIS TIME!" Peter cried, but his voice echoed uselessly across the empty hills.

Thinking quickly, Peter grabbed his shepherd's staff and began making as much noise as possible, banging it against rocks and shouting. The loud commotion startled the wolf, who decided the sheep weren't worth the trouble and ran back into the forest.

Peter sat down on his rock, shaking and breathing heavily. He had managed to scare the wolf away, but he realized how close he had come to losing the sheep – and how his lies had put them all in danger.

When Peter returned to the village that evening, he went to each of the farmers who had tried to help him before.

"I'm very sorry," he said sincerely. "I lied to you, and today when there really was a wolf, no one believed me. I understand now that lying is wrong, and I promise I will always tell the truth from now on."

The villagers saw that Peter had learned his lesson. "We forgive you, Peter," said the blacksmith kindly. "But remember, when people can't trust your words, they won't be there to help you when you really need them."

From that day forward, Peter never lied again. He learned that honesty and trust are precious gifts that, once broken, are very hard to repair. The villagers came to trust him again, and Peter became known as one of the most honest and reliable people in the village.

And whenever he told this story to younger children, he would always end by saying, "Remember, always tell the truth, because your word is the most valuable thing you own."

The End.`,
          readingTime: 10,
          ageGroup: "4-8 years",
          tags: ["moral", "honesty", "trust", "consequences", "fable"],
          isFavorite: false,
          readCount: 0,
          category: "3"
        },
        {
          id: "302",
          title: "The Tortoise and the Hare",
          description: "Confident and boastful, the hare challenges the slow tortoise to a race, certain of his victory. But overconfidence leads to a nap, and the tortoise's steady pace earns him the unexpected win. A delightful fable showing that perseverance triumphs over arrogance.",
          image: "https://images.unsplash.com/vector-1738590592643-6c848d2a02f2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `In a sunny meadow at the edge of a peaceful forest, there lived many animals who were all good friends. Among them was a hare named Flash, who was very proud of how fast he could run, and a tortoise named Shelly, who moved very slowly but was known for being kind and determined.

Flash loved to show off his speed. Every morning, he would race around the meadow, leaping over rocks and darting between trees. "Look how fast I am!" he would call to the other animals. "I'm the fastest animal in the whole forest!"

Shelly, meanwhile, would slowly make her way around the meadow, stopping to smell flowers and chat with friends. She never seemed to be in a hurry and always had a cheerful word for everyone.

One day, Flash was feeling particularly boastful. He had just finished running ten laps around the meadow and wasn't even breathing hard.

"I'm so fast," Flash bragged to a group of animals, "I could beat anyone in a race – even with my eyes closed!"

"That's very impressive, Flash," said Shelly in her gentle voice as she slowly approached the group.

Flash looked down at the tortoise and laughed. "Oh, Shelly! You're so slow, it would take you all day just to cross the meadow. I could run to the other side and back before you even got halfway!"

Shelly smiled patiently. "You're certainly very fast, Flash. But you know, speed isn't everything."

"Oh really?" Flash said with a smirk. "I'll prove it to you. Let's have a race! We'll race from here to the big oak tree on the other side of the meadow. I'll show everyone that being fast is what really matters!"

The other animals looked worried. They knew Flash was much faster than Shelly, and they didn't want to see their friend the tortoise get embarrassed.

But Shelly nodded calmly. "All right, Flash. I accept your challenge."

"This will be the easiest race I've ever won," Flash chuckled.

The wise old owl, who lived in the oak tree, agreed to be the judge. All the forest animals gathered to watch the race. The rabbit family, the squirrels, the deer, and even the field mice came to see what would happen.

"Racers, take your positions," called the owl from his perch. Flash crouched down in a perfect starting position, his powerful legs ready to spring forward. Shelly simply stood at the starting line, looking calm and determined.

"On your mark... get set... GO!" hooted the owl.

Flash shot forward like an arrow, his legs moving so fast they were just a blur. In seconds, he had covered a quarter of the distance to the oak tree. Shelly, meanwhile, had taken just a few slow steps forward.

"This is too easy!" Flash called over his shoulder. He was already halfway to the finish line while Shelly had barely moved from the starting position.

Flash was so far ahead that he decided to have some fun. He ran in circles, did some fancy jumps, and even ran backward for a while, just to show off. The other animals shook their heads at his boastful behavior.

When Flash looked back, he could barely see Shelly in the distance, still moving forward with her slow, steady steps.

"At this rate, it'll take her hours to finish," Flash said to himself. "I have so much time, I could take a nice nap and still win easily."

Flash found a comfortable spot under a shady tree, just a short distance from the finish line. "I'll just rest my eyes for a few minutes," he yawned. "When I wake up, I'll still have plenty of time to cross the finish line before Shelly gets anywhere close."

Soon, Flash was fast asleep, snoring softly in the warm afternoon sun.

Meanwhile, Shelly continued her slow but steady journey across the meadow. Step by step, she moved forward, never stopping, never giving up. She passed the halfway point, then three-quarters of the way, always keeping the oak tree in sight.

The other animals watched in amazement as the determined tortoise kept going, while the hare slept peacefully under his tree.

As the sun began to set, Shelly was getting close to the finish line. The animals started to whisper excitedly.

"Look! Shelly's almost there!"

"Should we wake up Flash?"

"Shh! Let's see what happens!"

Just as Shelly was a few steps away from the oak tree, Flash woke up from his nap. He stretched and yawned, then looked toward the finish line.

His eyes went wide with shock. There was Shelly, just about to cross the finish line!

"No!" Flash cried, jumping to his feet. He ran as fast as he had ever run in his life, his legs moving like lightning. But it was too late.

Just as Flash reached the oak tree, Shelly crossed the finish line.

"The winner is Shelly the tortoise!" announced the owl.

All the animals cheered and gathered around Shelly to congratulate her. Flash stood there with his mouth open, unable to believe what had happened.

"But... but... I'm so much faster than you!" Flash stammered.

Shelly smiled kindly at the surprised hare. "You are indeed very fast, Flash. But I kept moving forward while you were sleeping. Sometimes, being steady and determined is more important than being fast."

Flash felt ashamed of his boastful behavior. "I'm sorry, Shelly. I was so busy showing off and being overconfident that I forgot the most important thing – to actually finish the race. You deserved to win."

"Thank you, Flash," said Shelly. "But you know what? We could both be winners if we learned from each other. You could teach me to be a little faster, and I could teach you to be more patient and steady."

From that day on, Flash and Shelly became the best of friends. Flash learned not to be boastful and to always finish what he started. Shelly learned that sometimes it's good to move a little faster when needed.

And all the animals in the meadow learned an important lesson: slow and steady wins the race, and it's not how fast you go, but how determined you are to reach your goal.

The End.`,
          readingTime: 12,
          ageGroup: "4-8 years",
          tags: ["moral", "perseverance", "humility", "determination", "fable"],
          isFavorite: false,
          readCount: 0,
          category: "3"
        }
      ]
    },
    {
      id: "4",
      name: "Bedtime Stories",
      description: "Gentle, soothing stories perfect for winding down at the end of the day",
      color: "#9B59B6",
      icon: "nights-stay",
      stories: [
        {
          id: "401",
          title: "Goodnight Moon",
          description: "In a quiet green room, a little bunny says goodnight to everything around — the moon, the kittens, the mittens, and more. The gentle rhythm of this bedtime poem creates a sense of calm, easing children into sweet dreams. It's a perfect story to end a long day.",
          image: "https://images.unsplash.com/vector-1738590592643-6c848d2a02f2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `In the great green room, there was a telephone, and a red balloon, and a picture of a cow jumping over the moon.

And there were three little bears sitting on chairs, and two little kittens, and a pair of mittens, and a little toy house, and a young mouse.

And a comb and a brush and a bowl full of mush, and a quiet old lady who was whispering "hush."

The little bunny was tucked snugly in his bed, his head resting on a soft pillow. The room was filled with all his favorite things, and everything felt safe and cozy.

"Goodnight room," said the little bunny, looking around at his peaceful bedroom.

"Goodnight moon," he whispered, gazing out the window at the bright, round moon shining in the dark sky.

"Goodnight cow jumping over the moon," he said to the funny picture on his wall that always made him smile.

"Goodnight light, and the red balloon," the bunny continued, watching the balloon float gently near the ceiling.

"Goodnight bears, goodnight chairs," he said to his three teddy bears who sat watching over him from their little chairs.

"Goodnight kittens, and goodnight mittens," the bunny yawned, feeling sleepier with each word.

"Goodnight clocks, and goodnight socks," he murmured, his eyelids growing heavy.

"Goodnight little house, and goodnight mouse," he whispered to the tiny toy house and the little mouse who lived there.

"Goodnight comb, and goodnight brush," the bunny said softly, thinking of how his mama had brushed his fur before bedtime.

"Goodnight nobody, goodnight mush," he sighed contentedly.

"And goodnight to the old lady whispering hush," the bunny said to his grandmother, who sat quietly in her rocking chair, keeping watch over him.

The room grew quieter and darker as the bunny said goodnight to each beloved thing. The moon outside his window seemed to glow more softly, and the stars twinkled like tiny nightlights in the sky.

"Goodnight stars, goodnight air," the little bunny breathed peacefully.

"Goodnight noises everywhere," he whispered as the gentle sounds of the night settled around him like a soft blanket.

The little bunny closed his eyes and snuggled deeper into his warm bed. All around him, his room was filled with love and comfort. The moon watched over him through the window, the old lady kept her gentle vigil, and everything in the great green room was exactly as it should be.

Soon, the little bunny was fast asleep, dreaming sweet dreams of cows jumping over the moon, friendly bears, and soft mittens. The quiet old lady smiled and whispered one last "hush" before the room fell into peaceful silence.

And in that great green room, everything slept soundly until morning came again.

Goodnight.

The End.`,
          readingTime: 5,
          ageGroup: "2-6 years",
          tags: ["bedtime", "gentle", "soothing", "routine", "comfort"],
          isFavorite: false,
          readCount: 0,
          category: "4"
        },
        {
          id: "402",
          title: "The Sleepy Owl",
          description: "Unlike the other owls, Oliver finds himself sleepy at night and awake when the sun shines. Curious about the day, he sets off on new adventures under the bright sky. This heartwarming tale helps little ones embrace who they are, even if they're a bit different.",
          image: "https://images.unsplash.com/vector-1738590592643-6c848d2a02f2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `High up in the tallest oak tree in Whispering Woods lived a young owl named Oliver. Oliver had soft, fluffy feathers the color of autumn leaves and big, round eyes that sparkled with curiosity.

But Oliver was different from all the other owls in the forest. While his family and friends were wide awake all night, hooting and hunting and having owl adventures, Oliver found himself getting very, very sleepy as soon as the sun went down.

"Hoo-hoo, Oliver!" called his sister Olivia one evening. "Come fly with us! The moon is bright and perfect for exploring!"

Oliver tried to keep his eyes open, but they felt so heavy. "I'm sorry, Olivia," he yawned. "I just can't seem to stay awake when it gets dark."

His parents were puzzled. "All owls are supposed to be nocturnal," said Papa Owl. "We're meant to be awake at night and sleep during the day."

"Maybe Oliver just needs more practice," suggested Mama Owl kindly.

But no matter how hard Oliver tried, as soon as the stars came out, he would curl up in his cozy nest and fall fast asleep. And when the first rays of sunshine peeked through the forest canopy, Oliver would wake up feeling bright and energetic.

"Good morning, world!" Oliver would chirp happily, stretching his wings in the warm sunlight.

His family would just be returning from their nighttime adventures, tired and ready for their daytime sleep.

"Shh, Oliver," Papa Owl would whisper. "It's time for owls to sleep now."

But Oliver wasn't sleepy at all during the day. While his family dozed in their tree, he would sit on his branch, watching the forest come alive with daytime creatures.

He saw rabbits hopping through the grass, squirrels chattering as they gathered acorns, and colorful birds singing beautiful songs. The forest looked so different in the daylight – everything was bright and green and full of activity.

"I wonder what it would be like to explore the forest during the day," Oliver thought to himself.

One particularly sunny morning, when his family was sound asleep, Oliver made a decision. "I'm going to see what the daytime world is all about," he whispered to himself.

Quietly, so as not to wake his family, Oliver spread his wings and flew down from the oak tree. The warm sunshine felt wonderful on his feathers, and he could see everything so clearly in the bright light.

As he landed on a low branch, a friendly robin named Ruby noticed him.

"Hello there!" chirped Ruby. "I've never seen an owl out during the day before. Are you lost?"

"Oh no," said Oliver shyly. "I'm just different from other owls. I like being awake when the sun is shining."

Ruby tilted her head curiously. "That is unusual, but how wonderful! Would you like me to show you around the daytime forest?"

Oliver's eyes lit up with excitement. "I would love that!"

Ruby introduced Oliver to all the daytime forest friends. There was Benny the rabbit, who showed Oliver the best patches of clover. There were the chattering squirrels, who taught him which trees had the sweetest nuts. And there was a wise old turtle named Theodore, who told fascinating stories about the forest's history.

"You know, Oliver," said Theodore slowly, "being different isn't something to worry about. It's something special. You get to see the world in a way that other owls never do."

As the day went on, Oliver discovered that his owl abilities were actually very helpful during the day too. His excellent eyesight helped him spot things that other animals missed, and his silent flying helped him move through the forest without disturbing anyone.

When a baby bird fell from its nest, Oliver's keen eyes spotted it immediately, and he was able to help return it safely to its family.

When some field mice got lost in the tall grass, Oliver flew high above the trees and guided them back to their home.

"Oliver, you're amazing!" said Ruby. "You use your owl gifts to help everyone during the day!"

As the sun began to set, Oliver felt his usual sleepiness coming on. "I should head home now," he yawned. "Thank you for showing me your world."

"Thank you for sharing your special gifts with us," said all his new daytime friends.

When Oliver returned to his oak tree, his family was just waking up for their nighttime activities.

"Where have you been, Oliver?" asked Mama Owl with concern.

Oliver told his family all about his daytime adventures and the friends he had made. At first, his parents were worried, but as they listened to his stories, they began to understand.

"It sounds like you found where you belong," said Papa Owl thoughtfully.

"But you're still our Oliver," added Mama Owl, nuzzling him with her wing. "And we love you just the way you are."

From that day forward, Oliver lived happily as a daytime owl. His family learned to appreciate his unique schedule, and sometimes they would even stay up a little later in the morning to hear about his daytime adventures.

Oliver learned that being different wasn't something to be ashamed of – it was his special gift. He became known throughout the forest as the helpful daytime owl, always ready to lend a wing to any creature in need.

And every evening, as Oliver settled into his cozy nest while his family prepared for their nighttime activities, he would smile contentedly, knowing that tomorrow would bring another day full of sunshine, friendship, and wonderful adventures.

"Goodnight, daytime world," Oliver would whisper as he drifted off to sleep. "See you in the morning."

The End.`,
          readingTime: 8,
          ageGroup: "3-7 years",
          tags: ["bedtime", "acceptance", "being different", "friendship", "gentle"],
          isFavorite: false,
          readCount: 0,
          category: "4"
        }
      ]
    }
  ]
};

// Data transformation utilities
export const transformLegacyStoryToEnhanced = (story: Story): EnhancedStory => {
  return {
    ...story,
    content: story.content || '',
    readingTime: Math.ceil((story.content?.length || 0) / 200), // Estimate based on average reading speed
    ageGroup: '4-8 years', // Default age group
    tags: [],
    isFavorite: false,
    readCount: 0
  };
};

export const transformEnhancedStoryToLegacy = (story: EnhancedStory): Story => {
  return {
    id: story.id,
    title: story.title,
    description: story.description,
    image: story.image,
    content: story.content,
    category: story.category || undefined
  };
};

export const getStoriesByCategory = (categoryId: string): EnhancedStory[] => {
  const category = enhancedStoriesData.categories.find(cat => cat.id === categoryId);
  return category ? category.stories : [];
};

export const getAllStories = (): EnhancedStory[] => {
  return enhancedStoriesData.categories.flatMap(category => category.stories);
};

export const getStoryById = (storyId: string): EnhancedStory | null => {
  const allStories = getAllStories();
  return allStories.find(story => story.id === storyId) || null;
};

export const getCategoryById = (categoryId: string): StoryCategory | null => {
  return enhancedStoriesData.categories.find(category => category.id === categoryId) || null;
};

// Export enhanced data as default
export default enhancedStoriesData;
export type { StoryCategory, EnhancedStory };