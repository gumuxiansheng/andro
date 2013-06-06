<?php 
class commentspost extends x_table2 {
    function main() {
        $page = gp('page');
        $row = aFromGp('inp_comments_');
        $row['page'] = $page;
        $row['notes'] = str_replace('<','&lt;',$row['notes']);
        $row['notes'] = str_replace('>','&gt;',$row['notes']);
        $row['notes'] = str_replace('[b]','<b>',$row['notes']);
        $row['notes'] = str_replace('[/b]','</b>',$row['notes']);
        $row['notes'] = str_replace('[i]','<i>',$row['notes']);
        $row['notes'] = str_replace('[/i]','</i>',$row['notes']);
        $row['notes'] = str_replace('[pre]','<pre>',$row['notes']);
        $row['notes'] = str_replace('[/pre]','</pre>',$row['notes']);
               
        emailSend('dorgan@donaldorgan.com','Comment Discarded'
            ,"This comment was discarded:\n"
            ."\nnickname: ".$row['name']
            ."\nemail:    ".$row['email']
            ."\n\n"
            .$row['notes']
        );

        SQLX_Insert('comments',$row);
        if(!Errors()) {
//            include_once('x_table2.php');
            emailSend('dorgan@donaldorgan.com','New User Comment'
                ,'A new user comment awaits moderation'
                ."\n\nnickname: ".$row['name']
                ."\nemail:    ".$row['email']
                ."\n\n"
                .$row['notes']
            );
        }
        $name = makeFileStem($page).'.html';
        ?>
        <script>
        alert("Your comment has been posted for moderation");
        window.location="<?php echo $name?>"
        </script>
        <?php
        exit;
    }
}
?>
